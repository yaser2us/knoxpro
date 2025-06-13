// // workflow-run.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
// import { WorkflowTemplate } from './workflow.template.entity';

// @Entity('workflow_run')
// export class WorkflowRun {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid' })
//   document_id: string;

//   @ManyToOne(() => WorkflowTemplate)
//   @JoinColumn({ name: 'template_id' })
//   template: WorkflowTemplate;

//   @Column()
//   version: string;

//   @Column({ default: 'running' })
//   status: 'running' | 'paused' | 'waiting' | 'completed' | 'failed';

//   @Column({ default: 0 })
//   current_step_index: number;

//   @Column({ type: 'jsonb', default: {} })
//   context: Record<string, any>;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;
// }

// workflow-run.entity.ts (UPDATED)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { WorkflowTemplate } from './workflow.template.entity';

@Entity('workflow_run')
export class WorkflowRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  document_id: string;

  @ManyToOne(() => WorkflowTemplate)
  @JoinColumn({ name: 'template_id' })
  template: WorkflowTemplate;

  @Column()
  version: string;

  // 🔧 UPDATED: Added more status types for orchestration
  @Column({ default: 'running' })
  status: 'running' | 'paused' | 'waiting' | 'completed' | 'failed' | 'cancelled';

  // 🔧 UPDATED: Changed to step_id instead of step_index for better tracking
  @Column({ type: 'varchar', nullable: true })
  current_step_id: string | null;

  // 🔧 KEEP: Still useful for UI display
  @Column({ default: 0 })
  current_step_index: number;

  @Column({ type: 'jsonb', default: {} })
  context: Record<string, any>;

  // 🆕 NEW: Orchestration-specific fields
  @Column({ type: 'uuid', nullable: true })
  created_by_user_id: string | null;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  paused_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  resumed_at: Date | null;

  // 🆕 NEW: Resume scheduling for long delays
  @Column({ type: 'timestamp', nullable: true })
  resume_at: Date | null;

  @Column({ type: 'varchar', nullable: true })
  pause_reason: string | null;

  // 🆕 NEW: Final result storage
  @Column({ type: 'jsonb', nullable: true })
  final_result: Record<string, any> | null;

  // 🆕 NEW: Error tracking
  @Column({ type: 'text', nullable: true })
  last_error: string | null;

  @Column({ type: 'int', default: 0 })
  retry_count: number;

  // 🆕 NEW: Performance tracking
  @Column({ type: 'int', nullable: true })
  total_steps: number | null;

  @Column({ type: 'int', default: 0 })
  completed_steps: number;

  @Column({ type: 'int', nullable: true })
  estimated_duration_seconds: number | null;

  @Column({ type: 'int', nullable: true })
  actual_duration_seconds: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 🛠️ Helper methods for orchestration
  get progress(): number {
    if (!this.total_steps || this.total_steps === 0) return 0;
    return Math.round((this.completed_steps / this.total_steps) * 100);
  }

  get isRunning(): boolean {
    return this.status === 'running';
  }

  get isPaused(): boolean {
    return this.status === 'paused';
  }

  get isWaiting(): boolean {
    return this.status === 'waiting';
  }

  get isCompleted(): boolean {
    return ['completed', 'failed', 'cancelled'].includes(this.status);
  }

  get canResume(): boolean {
    return ['paused', 'waiting'].includes(this.status);
  }
}