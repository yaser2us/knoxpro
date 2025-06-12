// workflow-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { WorkflowRun } from './workflow.run.entity';

@Entity('workflow_log')
export class WorkflowLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkflowRun)
  @JoinColumn({ name: 'workflow_run_id' })
  workflow_run: WorkflowRun;

  @Column({ type: 'int', nullable: true })
  step_index: number | null;

  @Column()
  type: 'triggered' | 'workflow_triggered' | 'trigger_error' | 'resumed' | 'failed' | 'skipped' | 'completed' | 'manual_edit' | 'trigger_failed' 
  // 'triggered' | 'resumed' | 'failed' | 'skipped' | 'completed' | 'manual_edit';

  @Column()
  message: string;

  @Column({ type: 'uuid', nullable: true })
  actor_user_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  actor_workspace_id: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
