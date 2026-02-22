import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';
import { User, Workspace } from '../../core/entity';

@Entity('mission_definitions')
export class MissionDefinition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    code: string; // Unique identifier like "PROFILE_COMPLETE", "ADD_CARER"

    @Column()
    name: string; // Display name like "Complete Your Profile"

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    category: string; // e.g., "onboarding", "engagement", "referral"

    @Column({ default: 'active' })
    status: string; // "active", "inactive", "archived"

    @Column('jsonb', { nullable: true })
    criteria: Record<string, any>; // Completion rules/requirements

    @Column('jsonb', { nullable: true })
    rewards: Record<string, any>; // Reward configuration (amount, type, etc.)

    @Column('jsonb', { nullable: true })
    metadata: Record<string, any>; // Additional configuration

    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by_user_id' })
    createdBy: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
