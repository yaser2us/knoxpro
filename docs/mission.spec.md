````md
# Mission Plugin – Implementation Backlog (Linux Mindset, Option B Async, New DB Strict)

> Goal: Implement the **Mission plugin** using the **new database design (as-of-now tables)**.
> Architecture: **Core (kernel primitives) + Plugins (modules) + Experience APIs (userland) + Legacy Adapter (compat shell)**.
> Strategy: **Option B async-first** using **outbox_event + outbox_event_consume** for side effects and cross-plugin integration.

---

## 0) Ownership & Boundaries (Non-Negotiable)

### Mission Plugin OWNS these tables (write access):
- `mission_definition`
- `mission_assignment`
- `mission_event`
- `mission_progress`
- `mission_reward_grant`
- `mission_submission`
- `mission_submission_file`

### Core OWNS these tables (Mission plugin may write ONLY through Core services/commands, never directly if you enforce strict layer):
- `ledger_txn`, `ledger_entry` (coin credit is done via Core Ledger command)
- `file_object` (attachments handled via Core File service)
- `outbox_event`, `outbox_event_consume` (Mission writes outbox rows; worker consumes/publishes)

### Mission Plugin MUST NOT:
- Write tables owned by other plugins (claims, referral, etc.)
- Call other plugins synchronously for critical flows (publish outbox events instead)

---

## 1) Delivery Output Required

You must deliver:
1) Mission **Service APIs** (resource operations) – mostly JSON:API
2) Mission **Experience APIs** (commands/use cases) – custom (REST or JSON-RPC)
3) Mission **Outbox events** (produced) + **Worker** (publisher/consumer)
4) Minimal **legacy adapter mapping** (only if legacy routes exist for missions)
5) Tests: unit + integration + idempotency + state transitions

---

## 2) API Layers & Rules

### 2.1 Service APIs (JSON:API)
- Purpose: CRUD + query + relationships
- No business orchestration, no cross-table workflows
- Must enforce basic invariants (FK existence, required fields)

### 2.2 Experience APIs (Commands)
- Purpose: business actions and state transitions
- Must be idempotent where required (use `idempotency_key` columns)
- Must write `outbox_event` in the same DB transaction

### 2.3 Legacy Adapter (BFF)
- Purpose: map legacy endpoints to Experience APIs
- No domain logic
- Only transform request/response shapes

---

## 3) Mission State Model (Conceptual)

### Assignment lifecycle (example)
- `assigned` → `started` → `completed`
- Completion may be automatic (criteria met) or manual (submission approved)

### Submission lifecycle (example)
- `draft` → `submitted` → `approved|rejected`

### Reward grant
- Exactly once per assignment (enforced by unique constraint on `mission_reward_grant`)

---

## 4) Backlog – Mission Service APIs (JSON:API)

> Implement using `nestjs-json-api` where feasible.

### M-SVC-01: Mission Definition Resource (Admin)
- JSON:API resource: `mission_definition`
- Endpoints (typical JSON:API):
  - `GET /jsonapi/mission-definitions`
  - `GET /jsonapi/mission-definitions/:id`
  - `POST /jsonapi/mission-definitions`
  - `PATCH /jsonapi/mission-definitions/:id`
  - `DELETE /jsonapi/mission-definitions/:id` (optional, prefer soft-disable if column exists)
- Notes:
  - Support filters like `status`, `code`, `category` if present
- Acceptance:
  - Admin can create/disable missions without breaking assignments

### M-SVC-02: Mission Assignment Resource
- JSON:API resource: `mission_assignment`
- Endpoints:
  - `GET /jsonapi/mission-assignments` (filter by user_id, mission_definition_id, status)
  - `GET /jsonapi/mission-assignments/:id`
  - `PATCH /jsonapi/mission-assignments/:id` (restricted fields only, admin-only if needed)
- Acceptance:
  - User can list own assignments; admin can query any user’s assignments

### M-SVC-03: Mission Submission Resource (Draft CRUD)
- JSON:API resource: `mission_submission`
- Endpoints:
  - `GET /jsonapi/mission-submissions` (filter by assignment_id, user_id, status)
  - `GET /jsonapi/mission-submissions/:id`
  - `POST /jsonapi/mission-submissions` (create draft)
  - `PATCH /jsonapi/mission-submissions/:id` (edit draft; blocked if status != draft)
- Acceptance:
  - Draft can be created/edited; cannot edit after submit

### M-SVC-04: Mission Submission File Resource
- JSON:API resource: `mission_submission_file`
- Endpoints:
  - `GET /jsonapi/mission-submission-files` (filter by submission_id)
  - `POST /jsonapi/mission-submission-files` (link file)
  - `DELETE /jsonapi/mission-submission-files/:id`
- Rules:
  - Must reference `file_object` (owned by Core File service)
- Acceptance:
  - Can link/unlink files to a submission; validation ensures file exists

### M-SVC-05: Mission Progress Read Resource (Optional)
- JSON:API resource: `mission_progress`
- Endpoints:
  - `GET /jsonapi/mission-progress` (filter by assignment_id)
- Acceptance:
  - Progress is visible to user/admin; writes should be via commands only

### M-SVC-06: Mission Reward Grant Read Resource (Optional)
- JSON:API resource: `mission_reward_grant`
- Endpoints:
  - `GET /jsonapi/mission-reward-grants` (filter by assignment_id, user_id)
- Acceptance:
  - Reward grants are read-only externally

### M-SVC-07: Mission Event Read Resource (Optional/Internal)
- JSON:API resource: `mission_event`
- Endpoints:
  - `GET /jsonapi/mission-events` (filter by assignment_id, ref_type, ref_id)
- Acceptance:
  - Events queryable for debugging/admin; writes via commands only

---

## 5) Backlog – Mission Experience APIs (Commands)

> Implement as custom REST (`/missions/commands/...`) OR JSON-RPC methods.
> MUST be transactional: domain writes + `outbox_event` insert in the same transaction.

### M-CMD-01: Assign Mission to User (Idempotent)
- Endpoint: `POST /missions/commands/assign`
- Input:
  - `mission_definition_id` or `mission_code`
  - `user_id`
  - `idempotency_key` (recommended)
- Writes:
  - create `mission_assignment` (unique per mission+user)
  - outbox: `MISSION_ASSIGNED`
- Acceptance:
  - repeated same request does not create duplicate assignment

### M-CMD-02: Start Mission
- Endpoint: `POST /missions/commands/start`
- Input: `assignment_id`
- Writes:
  - update assignment status + started_at (if columns exist)
  - outbox: `MISSION_STARTED`
- Acceptance:
  - cannot start if already completed; idempotent start is safe

### M-CMD-03: Record Mission Event (Idempotent)
- Endpoint: `POST /missions/commands/event`
- Input:
  - `assignment_id`
  - `event_type`
  - `ref_type`, `ref_id` (optional)
  - `payload_json` (optional)
  - `idempotency_key` (required if table supports it)
- Writes:
  - insert `mission_event` (dedupe by idempotency key/unique constraint)
  - update/insert `mission_progress` (per metric_code if used)
  - outbox: `MISSION_EVENT_RECORDED`
- Acceptance:
  - duplicate event is ignored safely; progress updates remain correct

### M-CMD-04: Evaluate & Complete Mission
- Endpoint: `POST /missions/commands/complete`
- Input: `assignment_id`
- Logic:
  - evaluate criteria from `mission_definition` config / rules json
  - ensure completion rules satisfied (progress/events/submission approval)
- Writes:
  - update assignment to completed
  - outbox: `MISSION_COMPLETED`
- Acceptance:
  - cannot complete unless criteria met
  - completion is idempotent

### M-CMD-05: Submit Mission Submission (Idempotent)
- Endpoint: `POST /missions/commands/submissions/:id/submit`
- Input:
  - `submission_id`
  - `idempotency_key` (if supported)
- Writes:
  - set `mission_submission.status=submitted`, set submitted_at
  - outbox: `MISSION_SUBMISSION_SUBMITTED`
- Acceptance:
  - cannot submit unless draft
  - repeated submit is safe

### M-CMD-06: Review Submission (Approve/Reject)
- Endpoint: `POST /missions/commands/submissions/:id/review`
- Input:
  - `decision`: `approve|reject`
  - `feedback` (optional)
- Writes:
  - update reviewed_by, reviewed_at, status
  - outbox: `MISSION_SUBMISSION_REVIEWED`
- Acceptance:
  - only reviewer/admin role can do this
  - cannot review twice (or allow idempotent same decision)

### M-CMD-07: Grant Reward (Coins) – Exactly Once
- Endpoint: `POST /missions/commands/grant-reward`
- Trigger:
  - on completion OR on approval review (depends mission type)
- Input:
  - `assignment_id`
  - `user_id`
  - `amount`
  - `currency=COIN`
  - `idempotency_key`
- Writes:
  - insert `mission_reward_grant` (unique once per assignment)
  - insert outbox: `MISSION_REWARD_GRANTED`
  - call **Core Ledger command** to create `ledger_txn` + `ledger_entry`
    - should be async if strict: publish event `MISSION_REWARD_GRANTED` and let a **ledger worker** consume it
- Acceptance:
  - reward is **exactly once** per assignment even under retries
  - ledger credit is idempotent and auditable

---

## 6) Backlog – Outbox Events & Workers (Option B)

### M-EVT-01: Define Event Types (constants)
Produce these outbox types from Mission plugin:
- `MISSION_ASSIGNED`
- `MISSION_STARTED`
- `MISSION_EVENT_RECORDED`
- `MISSION_COMPLETED`
- `MISSION_SUBMISSION_SUBMITTED`
- `MISSION_SUBMISSION_REVIEWED`
- `MISSION_REWARD_GRANTED`

Payload pattern:
```json
{
  "type": "MISSION_COMPLETED",
  "aggregate": { "type": "mission_assignment", "id": "..." },
  "actor_user_id": "...",
  "data": { ... minimal required fields ... }
}
````

### M-WKR-01: Outbox Publisher Worker

* Poll `outbox_event` for mission events not published
* Publish to:

  * message bus (future Kafka) OR internal dispatcher
* Mark published with `outbox_event_consume` or status flags (depending schema)
* Acceptance:

  * at-least-once publish; downstream is idempotent

### M-WKR-02: Reward Grant Consumer (recommended)

* Consume `MISSION_REWARD_GRANTED`
* Call Core Ledger credit command (idempotent)
* Mark consume record in `outbox_event_consume`
* Acceptance:

  * if worker crashes mid-way, retry does not double-credit coins

---

## 7) Backlog – Security & Access Rules

### M-SEC-01: Authorization policies

* Users can only access:

  * their own assignments/submissions/progress/grants (unless admin/reviewer)
* Admin/reviewer can access all

### M-SEC-02: Input validation

* Validate mission exists and is active before assignment
* Validate submission belongs to assignment and user
* Validate file ownership/permissions when linking submission files

### M-SEC-03: Idempotency enforcement

* Use `idempotency_key` columns where present
* For commands, also support `Idempotency-Key` header mapped to persistence

---

## 8) Backlog – Test Plan (Required)

### M-TST-01: Assignment idempotency

* same mission+user assign called twice → 1 assignment

### M-TST-02: Event idempotency

* record mission_event twice with same idempotency key → 1 event

### M-TST-03: Completion rules

* cannot complete without criteria met

### M-TST-04: Reward exactly-once

* grant reward twice → only 1 `mission_reward_grant`
* ledger credit occurs once (even after retries)

### M-TST-05: Submission workflow

* draft edit allowed
* submit locks edits
* review sets final state

---

## 9) Backlog – Legacy Adapter (Only if needed now)

### M-LGY-01: Legacy route mapping (if legacy has mission endpoints)

* Map legacy “missions list” to `GET /jsonapi/mission-definitions` or experience endpoint
* Map legacy “submit mission” to command submit + attach-file link
* Transform response to legacy shape

Acceptance:

* legacy app can complete mission workflows without knowing new schema

---

## 10) Implementation Notes (Repo Layout)

Recommended NestJS module layout:

* `src/plugins/missions/`

  * `missions.module.ts`
  * `controllers/`

    * `missions-jsonapi.controller.ts` (resources)
    * `missions-command.controller.ts` (commands)
  * `services/`

    * `missions-domain.service.ts`
    * `missions-evaluator.service.ts` (criteria evaluation)
    * `missions-reward.service.ts` (grant once + outbox)
  * `entities/` (TypeORM)
  * `events/` (event type definitions)

Workers:

* `src/workers/outbox-publisher.worker.ts`
* `src/workers/mission-reward-consumer.worker.ts`

---

## 11) Definition of Done (Mission Plugin)

Mission plugin is “done” when:

* Service APIs (JSON:API) are usable for admin + user queries
* Commands support full mission lifecycle and are idempotent
* Outbox events are written for every command
* Reward grants credit coins exactly once via ledger (async recommended)
* Tests cover idempotency + workflow + reward once
* No cross-plugin DB writes exist
* Core remains unchanged except via its public commands

---