// workflow-log.entity.ts (UPDATED)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { WorkflowRun } from './workflow.run.entity';

@Entity('workflow_log')
export class WorkflowLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔧 UPDATED: Made optional for workflow-level logs
  @Column({ type: 'uuid', nullable: true })
  workflow_run_id: string | null;

  @ManyToOne(() => WorkflowRun, { nullable: true })
  @JoinColumn({ name: 'workflow_run_id' })
  workflow_run: WorkflowRun | null;

  @Column({ type: 'int', nullable: true })
  step_index: number | null;

  // 🆕 NEW: Step ID for better tracking
  @Column({ type: 'varchar', nullable: true })
  step_id: string | null;

  @Column({ type: 'varchar', nullable: true })
  step_name: string | null;

  // 🔧 UPDATED: Extended type list for orchestration
  @Column()
  type: 'triggered' | 'workflow_triggered' | 'trigger_error' | 'resumed' | 'failed' | 'skipped' |
    'completed' | 'manual_edit' | 'trigger_failed' | 'started' | 'paused' | 'cancelled' |
    'step_started' | 'step_completed' | 'step_failed' | 'step_timeout' | 'step_retrying' |
    'approval_requested' | 'approval_granted' | 'approval_rejected' | 'approval_timeout' |
    'module_task_delegated' | 'module_task_completed' | 'delay_started' | 'delay_completed' |
    'condition_evaluated' | 'parallel_started' | 'parallel_completed' | 'manual_task_created';

  @Column()
  message: string;

  @Column({ type: 'uuid', nullable: true })
  actor_user_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  actor_workspace_id: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // 🆕 NEW: Orchestration-specific fields
  @Column({ type: 'varchar', nullable: true })
  source_module: string | null; // 'pulse', 'knox', 'zoi', etc.

  @Column({ type: 'varchar', nullable: true })
  log_level: 'debug' | 'info' | 'warn' | 'error';

  // 🆕 NEW: Performance tracking
  @Column({ type: 'int', nullable: true })
  execution_time_ms: number | null;

  @Column({ type: 'jsonb', nullable: true })
  error_details: {
    error_type?: string;
    stack_trace?: string;
    retry_count?: number;
    can_retry?: boolean;
  } | null;

  // 🆕 NEW: Step result tracking
  @Column({ type: 'jsonb', nullable: true })
  step_result: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  step_input: Record<string, any> | null;

  // 🆕 NEW: Approval tracking
  @Column({ type: 'jsonb', nullable: true })
  approval_details: {
    approver_id?: string;
    approved?: boolean;
    comments?: string;
    approval_time?: string;
    timeout_at?: string;
  } | null;

  @CreateDateColumn()
  created_at: Date;
}
// // workflow-log.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
// import { WorkflowRun } from './workflow.run.entity';

// @Entity('workflow_log')
// export class WorkflowLog {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => WorkflowRun)
//   @JoinColumn({ name: 'workflow_run_id' })
//   workflow_run: WorkflowRun;

//   @Column({ type: 'int', nullable: true })
//   step_index: number | null;

//   @Column()
//   type: 'triggered' | 'workflow_triggered' | 'trigger_error' | 'resumed' | 'failed' | 'skipped' | 'completed' | 'manual_edit' | 'trigger_failed' 

//   @Column()
//   message: string;

//   @Column({ type: 'uuid', nullable: true })
//   actor_user_id: string | null;

//   @Column({ type: 'uuid', nullable: true })
//   actor_workspace_id: string | null;

//   @Column({ type: 'jsonb', nullable: true })
//   metadata: Record<string, any>;

//   @CreateDateColumn()
//   created_at: Date;
// }
