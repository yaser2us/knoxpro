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
import { DocumentTemplate } from './document.template.entity';

// src/zoi/entity/flow-template.entity.ts
interface FlowStep {
  id: string;
  action: string;
  [key: string]: any;
}

@Entity('flow_templates')
export class FlowTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string; // e.g., "v1.0"

  @Column()
  trigger: string; // e.g., "document.created"

  @Column()
  appliesTo: string; // e.g., "sample_form"

  @Column('jsonb')
  definitions: Record<string, any>; // for $ref

  @Column('jsonb')
  // steps: any[]; // ✅ This makes it iterable and usable in for...of
  steps: Record<string, any>; // Based on JSON schema from template

  @CreateDateColumn()
  createdAt: Date;
}

// @Entity('flow_templates')
// export class FlowTemplate {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => DocumentTemplate, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'document_template_id' })
//   template: DocumentTemplate;

//   @Column()
//   stepOrder: number;

//   @Column()
//   role: string;

//   @Column()
//   actionType: 'sign' | 'approve' | 'input' | 'review';

//   @Column({ default: true })
//   isRequired: boolean;

//   @Column({ default: false })
//   isParallel: boolean; // true = multiple people can do at same time
// }
