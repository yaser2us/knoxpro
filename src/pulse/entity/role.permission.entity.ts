import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { ResourceType } from './resource.type.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => ResourceType)
  @JoinColumn({ name: 'resource_type_id' })
  resourceType: ResourceType;

  @Column({ name: 'action_name' })
  actionName: string;
}
