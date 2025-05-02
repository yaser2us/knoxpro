// ----------------------
// Zoi Entities (TypeORM)
// ----------------------

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Document } from './document.entity';
import { User } from 'src/core/entity';
import { FlowTemplate } from './flow.template.entity';

// 5. DocumentFlow (optional for workflow step tracking)
@Entity('document_flows')
export class DocumentFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => FlowTemplate)
  @JoinColumn({ name: 'flow_template_id' })
  flowTemplate: FlowTemplate;

  @Column()
  stepPointer: string;

  @Column('jsonb', { default: {} })
  context: Record<string, any>;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  startedAt: Date;

  // v1 ;)
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  // @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'document_id' })
  // document: Document;

  // @Column()
  // stepOrder: number;

  // @Column()
  // role: string;

  // @Column()
  // actionType: 'sign' | 'approve' | 'input' | 'review';

  // @Column({ default: 'pending' })
  // status: 'pending' | 'completed' | 'skipped';

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'user_id' })
  // performedBy: User;

  // @Column({ type: 'timestamp', nullable: true })
  // completedAt: Date;
}