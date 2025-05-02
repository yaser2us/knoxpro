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
import { Workspace } from '../../core/entity';

// 1. DocumentTemplate
@Entity('document_templates')
export class DocumentTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @Column()
    name: string; // Human-friendly name, e.g. "Sample Form"

    @Column({ unique: true })
    type: string; // Machine name, e.g. "sample_form"

    @Column('jsonb')
    schema: Record<string, any>; // JSON Schema for meta

    @Column('jsonb', { nullable: true })
    uiHints: Record<string, any>; // Optional UI config

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}