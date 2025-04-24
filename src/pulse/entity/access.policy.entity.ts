// access-policy.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

// @Entity('access_policies')
// export class AccessPolicy {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   name: string;

//   @Column({ nullable: true })
//   description: string;

//   @Column({ name: 'resource_type' })
//   resourceType: string;

//   @Column({ name: 'action_type' })
//   actionType: string;

//   @Column({ type: 'jsonb' })
//   conditions: Record<string, any>;

//   @Column({ name: 'expires_in_days', nullable: true })
//   expiresInDays?: number;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;
// }

@Entity('access_policies')
export class AccessPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'resource_type' })
  resourceType: string;

  @Column({ name: 'action_type' })
  actionType: string;

  @Column({ type: 'jsonb' })
  conditions: Record<string, any>;

  @Column({ name: 'expires_in_days', nullable: true })
  expiresInDays?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
