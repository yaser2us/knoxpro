import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserRole } from '../../pulse/entity/user.role.entity';
import { AccessAction } from '../../pulse/entity/access.action.entity';
import { Workspace } from './workspace.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  domain: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => UserRole, role => role.user)
  roles: UserRole[];

  @OneToMany(() => AccessAction, action => action.actor)
  actions: AccessAction[];

  @ManyToOne(() => Workspace, workspace => workspace.users, { eager: true })
  workspace: Workspace;
}

