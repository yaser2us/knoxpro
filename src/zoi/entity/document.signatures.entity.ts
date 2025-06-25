import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../pulse/entity';
import { Document } from './document.entity';

@Entity('document_signatures')
export class DocumentSignature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Original fields (keep for backward compatibility)
    @Column()
    role: string;

    @Column()
    action: string;

    @Column({ nullable: true })
    signature: string;

    @Column({ name: 'signedAt' })
    signedAt: Date;

    @Column({ type: 'uuid', nullable: true })
    document_id: string | null;

    @Column({ type: 'uuid', nullable: true })
    user_id: string | null;

    // 🆕 NEW: Generic resource fields
    @Column({ nullable: true })
    resource_type: string;

    @Column({ type: 'uuid', nullable: true })
    resource_id: string | null;

    @Column({ nullable: true })
    workflow_step: string;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'timestamp', nullable: true, name: 'signed_at_nullable' })
    signed_at_nullable: Date | null;

    // Relationships
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Document, { nullable: true })
    @JoinColumn({ name: 'document_id' })
    document?: Document;
}