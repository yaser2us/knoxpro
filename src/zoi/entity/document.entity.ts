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
import { User, Workspace } from '../../core/entity';
import { DocumentTemplate } from './document.template.entity';

// 2. Document
@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => DocumentTemplate)
    @JoinColumn({ name: 'document_template_id' })
    template: DocumentTemplate;

    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @Column()
    title: string;

    @Column()
    type: string; // e.g., "sample_form"    

    @Column('jsonb', { nullable: true })
    metadata: Record<string, any>; // Based on JSON schema from template

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;
}
//