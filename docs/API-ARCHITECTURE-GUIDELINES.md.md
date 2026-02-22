According to a document from (DATE unknown in file metadata), the **tables I’m using are exactly from your new “as-of-now” database DDL** (the file you attached as `as-of-now-tables.md`). For Missions specifically, this includes `mission_definition`, `mission_assignment`, `mission_event`, `mission_progress`, `mission_reward_grant`, `mission_submission`, `mission_submission_file` (and the usual platform foundations like `outbox_event`, `outbox_event_consume`, and `ledger_*` for coin credit flows).

Below is the **Option B + Linux-mindset implementation instruction** you asked for, **Mission first**, written as a single Markdown doc that an AI/dev can follow.

---

# GC Pro API Build Instructions (Linux Mindset, Option B) — Mission First

## 0) What you’re building (3 API layers)

### A) Service APIs (per-table / per-resource)

Purpose: **pure operations** on data models (CRUD + relationships + querying).
Rule: “No business meaning.” Think “filesystem syscalls”.

* Example: create/update `mission_definition`, list `mission_submission`, query `mission_assignment` by `user_id`, etc.

### B) Experience APIs (use-cases / workflows)

Purpose: **business outcomes** that touch multiple tables, enforce invariants, publish events, and run idempotent workflows.
Rule: “This is where business lives.” Think “shell commands / coreutils composition”.

* Example: “assign mission to user”, “submit mission evidence”, “review submission”, “grant coins”.

### C) BFF layer (legacy adapter)

Purpose: **map legacy app calls** to Experience APIs and reformat responses to match legacy payloads.
Rule: “No business logic.” Only mapping/aggregation/compat.

---

## 1) Linux mindset rules (core + plugins)

### 1.1 Core vs Plugin

* **CORE** = shared foundations and cross-cutting capabilities:

  * identity/user/person/account
  * ledger (`ledger_txn`, `ledger_entry`) for all money/coin movements
  * outbox (`outbox_event`, `outbox_event_consume`) for async integration
* **PLUGIN** = one bounded domain with its own tables + service + experience APIs:

  * Missions is a plugin (tables prefixed `mission_*`).
  * Wallet/Coins is a plugin but **coin crediting must go through CORE ledger** (currency `COIN`) if you want consistent accounting.

### 1.2 Plugin boundaries (hard rule)

* A plugin **owns** its tables.
* Another plugin may read via service API or subscribe to events, but **does not write** tables it doesn’t own (except CORE tables through defined CORE services).

### 1.3 “Everything is a file” equivalent

* Each table/resource gets a predictable JSON:API interface (where applicable).
* Commands are explicit endpoints (or JSON-RPC methods) when the operation:

  * touches multiple tables
  * needs idempotency beyond CRUD
  * must emit outbox events
  * enforces state machines (status transitions)

---

## 2) Option B (Async-first via Outbox) — mandatory

### 2.1 Why Option B

You want the system to be resilient and scalable: service APIs write data + write outbox events in the same transaction; background workers publish/process them later. This avoids coupling and “sync chain explosions”.

### 2.2 Required tables already exist

* `outbox_event` and `outbox_event_consume` exist in your new schema.

### 2.3 Outbox contract

Every “business action” in Experience APIs must:

1. validate + perform DB writes
2. insert an `outbox_event` record describing what happened
3. return immediately (do not call other services synchronously unless absolutely required)

---

## 3) When to use `nestjs-json-api` vs custom “command”

### 3.1 Use `nestjs-json-api` (JSON:API CRUD generator) when

Operation is **resource CRUD** + standard filters/sorts/pagination + relationships.

The repo explicitly supports “automatic CRUD generation, filtering, sorting, pagination, relationship handling.” ([GitHub][1])

### 3.2 Use custom command (REST or JSON-RPC) when

Any of these are true:

* changes multiple resources/tables in one “intent”
* state transition must be enforced (assigned → started → completed)
* must be idempotent at workflow-level (not just “POST create row”)
* must emit outbox events
* must grant coins / write ledger entries (financially sensitive)
* is a “review/approval” action

> Tip: This repo also supports JSON-RPC 2.0 alongside JSON:API. ([GitHub][1])
> So: CRUD = JSON:API; Commands = JSON-RPC **or** REST `/commands/*` endpoints.

---

# 4) Mission Plugin (FIRST) — Tables and how they work

## 4.1 Mission tables (source of truth)

From your new DDL:

* `mission_definition`: master catalog of missions (criteria/rewards in JSON).
* `mission_assignment`: per-user instance of mission participation; unique per (mission,user).
* `mission_tracking; idempotency supported.
* `mission_progress`: compu unique per (assignment,metric_code).
* `mis once per assignment” with idempotency key.
* `mission_submissiond/reviewed…) + reviewer fields + idempotency.
* `mi for submission.

## 4.2 Mission coins business meaning (from requssion Coins are engagement rewards, non-withdrawable, use.g. annual fee deduction), earned via missions like profile completion, add carer, referral, etc.

**Implementation rule**: granting coins is **not** “update a balance col

# 5) Mission Service APIs (JSON:API candidates)

These should be implemented using `nestjs-json-api` wherever possible.

## 5.1 JSON:API resources to expose (CRUD)

1. `mission_definition`

   * Admin CRUD (create/update/disable missions)
2. `mission_assignment`

   * read/list for user/admin (CRUD only if you allow admin intervention)
3. `mission_submission`

   * user create/update draft; user submit via command (see below) OR patch status with guard
4. `mission_submission_file`
5. `mission_event` (optional to expose; often internal)
6. `mission_progress` (often read-only externally)
7. `mission_reward_grant` (read-only externally)

### JSON:API usage fit

Because JSON:API layer can generate:

* standard `GET /api/<resource>` list
* `GET /api/<resource>/:id`
* `POST/PATCH/DELETE`
* relationship endpoints
  …this is ideal for operational/service endpoints. ([GitHub][1])

---

# 6) Mission Experience APIs (Commands) — required for parity

These are **custom**. You can implement as:

* REST: `POST /api/mission-commands/...`
* OR JSON-RPC methods (since the toolkit supports JSON-RPC 2.0). ([GitHub][1])

## 6.1 Command set (minimum)

### (C1) Assign mission to user

* Input: `mission_code|mission_id`, `user_id`, optional `idempotency_key`
* Writes:

  * insert `mission_assignment` (unique per mission/user)
  * outbox event: `MISSION_ASSIGNED`

### (C2) Start mission

* Input: `assignment_id`
* Writes:

  * update `mission_assignment.started_at`, `status=started` (if you use that state)
  * outbox event: `MISSION_STARTED`

### (C3) Record mission event (progress signal)

* Input: `assignment_id`, `event_type`, `ref_type/:contentReference[oaicite:29]{index=29}cy_key`
* Writes:

  * insert `mission_event` (idempotent)
  * update/insert `mission_progress` (idempotent per metric)
  * outbox event: `MISSION_EVENT_RECORDED`

### (C4) Complete mission (evaluate criteria + lock completion)

* Input: `assignment_id`
* Writes:

  * set `mission_assignment.completed_at`, `status=completed`
  * outbox eventnt reward (coins) — idempotent
* Trigger: typically after com- Input: `assignment_id`, `user_id`, `amount`, `currency=COIN`, `idempotency_key`
* Writes:

  * insert `mission_reward_grant` (unique per assignment + idempotent)
  * create ledger transaction (CORE): `ledger_txn` + `ledger_entry` currency `COIN` (exact tables in your schema)
  * outbox event: `MISSION_REWARD_GRANTED`

### (C6) Submit mission submission

* Input: `assignment_id`, submission payload, `idempotency_key`
* Writes:

  * update `m:contentReference[oaicite:36]{index=36}, `submitted_at=now()` (idempotent)
  * outbox event: `MISSION_SUBMISSION_SUBMITprove/reject)
* Input: `submission_id`, `decision`, `feedback`, reviewer user id
* Writes:

  * update `mission_submission.reviewed_by_user_id`, `reviewed_at`, `status`
  * if approve → run (C5) grant rewMISSION_REVIEWED`

---

# 7) BFF mapping rules (legacy adapter)

## 7.1 Mapping principle

* BFF receives legacy route/payload.
* BFF calls **Experience APIs** (not raw tables), then decorates/reshapes the response.
* BFF may call Service APIs for rrms writes directly** (no bypass).

## 7.2 Why this works for “rebuild legacy in new way”

Because you can:

* implement stable internal domain APIs (service + experience)
* keep legacy app running by adapting old endpoints → new experience APIs
* gradually replace legacy clients without changing business logic again

---

# 8) What to build first (Mission sequence)

1. Service APIs (JSON:API)

* `mission_definition` CRUD
* `mission_assignment` read/list
* `mission_submission` CRUD (draft)
* `mission_submission_file` CRUD
* (optional) read-only `mission_progress`, `mission_reward_grant`

2. Experience APIs (commands)

* Assign → Record Event → Complete → Grant Reward
* Submit → Review → (Grant Reward)

3. Outbox workers

* publish mission events to other plugins (notifications, analytics, etc.)
* ensure `outbox_event_consume` records processing idempotently

---

## 9) Guardrails (non-negotiables)

* Every command endpoint must support **idempotency** (use `idempotency_key` columns where provided).
* Reward grant must be **exactly-once** per assignment (`uk_mgrant_assignment_once`).ust be immutable; never “update balance” directly—derive from entries (or maintain a snapshot cache separately).
* Never couple plugins synchro.

---

## 10) “Where did you get the tables?”

* From your **new design DDL** in `as-oa we must strictly follow).
* The mission tables and constraints are explicitly defined there (see citations above).

---

If you want, next message I can turn **Mission** into a concrete backlog like:

* “JSON:API resources list”
* “Commands list”
* “Outbox events list”
* “State machine transitions”
* “Legacy endpoints → BFF mapping”

…but I kept this message as



[1]: https://raw.githubusercontent.com/klerick/nestjs-json-api/master/README.md "raw.githubusercontent.com"
