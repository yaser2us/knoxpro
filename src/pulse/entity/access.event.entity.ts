import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { AccessAction } from './access.action.entity';
import { User } from './user.entity';

@Entity('access_events')
export class AccessEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccessAction)
  @JoinColumn({ name: 'action_id' })
  action: AccessAction;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ name: 'resource_type' })
  resourceType: string;

  @Column({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'action_type' })
  actionType: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @CreateDateColumn({ name: 'occurred_at' })
  occurredAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
