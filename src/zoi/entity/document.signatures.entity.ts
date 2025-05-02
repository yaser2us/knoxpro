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
import { User } from '../../core/entity';
import { Document } from './document.entity';

// 4. DocumentSignature
@Entity('document_signatures')
export class DocumentSignature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Document, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'document_id' })
    document: Document;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    role: string; // Role of signer (trainer, lab supervisor, etc.)

    @Column()
    action: 'signed' | 'approved' | 'rejected';

    @Column({ nullable: true })
    signature: string; // base64 or SVG, etc.

    @Column({ type: 'timestamp' })
    signedAt: Date;
}