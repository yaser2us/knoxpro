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

// 3. DocumentAttachment
@Entity('document_attachments')
export class DocumentAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Document, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'document_id' })
    document: Document;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    mimeType: string;

    @Column({ nullable: true })
    uploadedBy: string;

    @CreateDateColumn()
    uploadedAt: Date;
}