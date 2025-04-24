 import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('access_actions')
export class AccessAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ name: 'resource_type' })
  resourceType: string;

  @Column({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'action_type' })
  actionType: string;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'one_time', default: false })
  oneTime: boolean;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any>;

  @Column({ default: true })
  enabled: boolean;

  @Column({ name: 'anonymous_token', nullable: true })
  anonymousToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}