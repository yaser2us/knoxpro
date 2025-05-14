// workflow-run.entity.ts
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

  @Column({ default: 'running' })
  status: 'running' | 'paused' | 'waiting' | 'completed' | 'failed';

  @Column({ default: 0 })
  current_step_index: number;

  @Column({ type: 'jsonb', default: {} })
  context: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}