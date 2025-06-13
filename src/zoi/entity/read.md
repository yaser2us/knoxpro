// 🆕 NEW: workflow-step-state.entity.ts (Optional, for complex workflows)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { WorkflowRun } from './workflow.run.entity';

@Entity('workflow_step_state')
@Index(['workflow_run_id', 'step_id'], { unique: true })
export class WorkflowStepState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workflow_run_id: string;

  @ManyToOne(() => WorkflowRun)
  @JoinColumn({ name: 'workflow_run_id' })
  workflow_run: WorkflowRun;

  @Column({ type: 'varchar' })
  step_id: string;

  @Column({ type: 'varchar' })
  step_name: string;

  @Column({ type: 'varchar' })
  step_type: 'module_task' | 'approval' | 'notification' | 'delay' | 'condition' | 'parallel' | 'manual';

  @Column()
  status: 'pending' | 'running' | 'waiting' | 'completed' | 'failed' | 'skipped' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  input_data: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  output_data: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  error_message: string | null;

  @Column({ type: 'int', default: 0 })
  retry_count: number;

  @Column({ type: 'int', nullable: true })
  max_retries: number | null;

  @Column({ type: 'int', nullable: true })
  timeout_seconds: number | null;

  @Column({ type: 'timestamp', nullable: true })
  timeout_at: Date | null;

  // For delays
  @Column({ type: 'timestamp', nullable: true })
  resume_at: Date | null;

  // For approvals
  @Column({ type: 'uuid', nullable: true })
  assigned_user_id: string | null;

  @Column({ type: 'varchar', nullable: true })
  assigned_module: string | null; // 'pulse', 'knox', etc.

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// 🆕 NEW: workflow-approval.entity.ts (For approval tracking)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index } from 'typeorm';
import { WorkflowRun } from './workflow.run.entity';

@Entity('workflow_approval')
export class WorkflowApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workflow_run_id: string;

  @ManyToOne(() => WorkflowRun)
  @JoinColumn({ name: 'workflow_run_id' })
  workflow_run: WorkflowRun;

  @Column({ type: 'varchar' })
  step_id: string;

  @Column({ type: 'varchar' })
  approval_type: string; // 'hr_approval', 'manager_approval', etc.

  @Column()
  status: 'pending' | 'approved' | 'rejected' | 'timeout';

  @Column({ type: 'uuid' })
  requested_by_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  approver_user_id: string | null;

  @Column({ type: 'text', nullable: true })
  request_message: string | null;

  @Column({ type: 'text', nullable: true })
  response_message: string | null;

  @Column({ type: 'timestamp', nullable: true })
  requested_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  responded_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  timeout_at: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  approval_data: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;
}

// 📋 MIGRATION GUIDE
export class MigrationGuide {
  /*
  🔧 DATABASE MIGRATION SCRIPT:
  
  -- Add new columns to workflow_run
  ALTER TABLE workflow_run 
  ADD COLUMN current_step_id VARCHAR,
  ADD COLUMN created_by_user_id UUID,
  ADD COLUMN started_at TIMESTAMP,
  ADD COLUMN completed_at TIMESTAMP,
  ADD COLUMN paused_at TIMESTAMP,
  ADD COLUMN resumed_at TIMESTAMP,
  ADD COLUMN resume_at TIMESTAMP,
  ADD COLUMN pause_reason VARCHAR,
  ADD COLUMN final_result JSONB,
  ADD COLUMN last_error TEXT,
  ADD COLUMN retry_count INTEGER DEFAULT 0,
  ADD COLUMN total_steps INTEGER,
  ADD COLUMN completed_steps INTEGER DEFAULT 0,
  ADD COLUMN estimated_duration_seconds INTEGER,
  ADD COLUMN actual_duration_seconds INTEGER;

  -- Update status column to include new values
  ALTER TABLE workflow_run 
  ALTER COLUMN status TYPE VARCHAR,
  ADD CONSTRAINT workflow_run_status_check 
  CHECK (status IN ('running', 'paused', 'waiting', 'completed', 'failed', 'cancelled'));

  -- Add new columns to workflow_log
  ALTER TABLE workflow_log 
  ADD COLUMN step_id VARCHAR,
  ADD COLUMN step_name VARCHAR,
  ADD COLUMN source_module VARCHAR,
  ADD COLUMN log_level VARCHAR DEFAULT 'info',
  ADD COLUMN execution_time_ms INTEGER,
  ADD COLUMN error_details JSONB,
  ADD COLUMN step_result JSONB,
  ADD COLUMN step_input JSONB,
  ADD COLUMN approval_details JSONB;

  -- Update type column to include new values
  ALTER TABLE workflow_log 
  ALTER COLUMN type TYPE VARCHAR;

  -- Make workflow_run_id nullable for trigger-level logs
  ALTER TABLE workflow_log 
  ALTER COLUMN workflow_run_id DROP NOT NULL;

  -- Create new tables (optional, for complex workflows)
  CREATE TABLE workflow_step_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_run_id UUID NOT NULL REFERENCES workflow_run(id),
    step_id VARCHAR NOT NULL,
    step_name VARCHAR NOT NULL,
    step_type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER,
    timeout_seconds INTEGER,
    timeout_at TIMESTAMP,
    resume_at TIMESTAMP,
    assigned_user_id UUID,
    assigned_module VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workflow_run_id, step_id)
  );

  CREATE TABLE workflow_approval (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_run_id UUID NOT NULL REFERENCES workflow_run(id),
    step_id VARCHAR NOT NULL,
    approval_type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending',
    requested_by_user_id UUID NOT NULL,
    approver_user_id UUID,
    request_message TEXT,
    response_message TEXT,
    requested_at TIMESTAMP,
    responded_at TIMESTAMP,
    timeout_at TIMESTAMP,
    approval_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Add indexes for performance
  CREATE INDEX idx_workflow_run_status ON workflow_run(status);
  CREATE INDEX idx_workflow_run_resume_at ON workflow_run(resume_at) WHERE resume_at IS NOT NULL;
  CREATE INDEX idx_workflow_run_current_step ON workflow_run(current_step_id);
  CREATE INDEX idx_workflow_log_workflow_run ON workflow_log(workflow_run_id);
  CREATE INDEX idx_workflow_log_type ON workflow_log(type);
  CREATE INDEX idx_workflow_log_created_at ON workflow_log(created_at);
  CREATE INDEX idx_workflow_step_state_status ON workflow_step_state(status);
  CREATE INDEX idx_workflow_approval_status ON workflow_approval(status);
  */
}

// 🎯 USAGE EXAMPLES WITH UPDATED ENTITIES
export class UpdatedEntityUsage {
  
  // Example: Creating a workflow run with orchestration support
  static async createWorkflowRun(templateId: string, documentId: string, userId: string) {
    const workflowRun = new WorkflowRun();
    workflowRun.document_id = documentId;
    workflowRun.template = { id: templateId } as WorkflowTemplate;
    workflowRun.version = '1.0';
    workflowRun.status = 'running';
    workflowRun.current_step_id = 'step_1';
    workflowRun.created_by_user_id = userId;
    workflowRun.started_at = new Date();
    workflowRun.total_steps = 5;
    workflowRun.completed_steps = 0;
    
    return workflowRun;
  }

  // Example: Logging workflow step with orchestration details
  static async logWorkflowStep(workflowRunId: string, stepId: string, stepName: string, result: any) {
    const log = new WorkflowLog();
    log.workflow_run_id = workflowRunId;
    log.step_id = stepId;
    log.step_name = stepName;
    log.type = 'step_completed';
    log.message = `Step ${stepName} completed successfully`;
    log.source_module = 'pulse';
    log.log_level = 'info';
    log.step_result = result;
    log.execution_time_ms = 2500;
    
    return log;
  }

  // Example: Creating approval record
  static async createApprovalRequest(workflowRunId: string, stepId: string, approverId: string) {
    const approval = new WorkflowApproval();
    approval.workflow_run_id = workflowRunId;
    approval.step_id = stepId;
    approval.approval_type = 'hr_manager_approval';
    approval.status = 'pending';
    approval.requested_by_user_id = 'system';
    approval.approver_user_id = approverId;
    approval.request_message = 'Please approve employee onboarding';
    approval.requested_at = new Date();
    approval.timeout_at = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days
    
    return approval;
  }
}

// 🎯 SUMMARY OF CHANGES
export class ChangesSummary {
  /*
  📋 REQUIRED CHANGES:

  WORKFLOW_RUN TABLE:
  ✅ Add current_step_id (for step tracking)
  ✅ Add orchestration timestamps (started_at, completed_at, paused_at, etc.)
  ✅ Add resume_at for long delays
  ✅ Add final_result and error tracking
  ✅ Add progress tracking fields
  ✅ Add 'cancelled' status

  WORKFLOW_LOG TABLE:
  ✅ Add step_id and step_name
  ✅ Expand type enum for orchestration events
  ✅ Add source_module and performance tracking
  ✅ Add step_result and approval_details
  ✅ Make workflow_run_id nullable

  NEW TABLES (OPTIONAL):
  ✅ workflow_step_state (detailed step tracking)
  ✅ workflow_approval (approval management)

  🎯 MINIMAL CHANGES NEEDED:
  If you want to start simple, just update:
  1. workflow_run: Add current_step_id, started_at, paused_at, resume_at
  2. workflow_log: Expand type enum, add step_id
  
  This will support basic orchestration functionality!
  */
}