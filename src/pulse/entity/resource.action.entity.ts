import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResourceType } from './resource.type.entity';

@Entity('resource_actions')
export class ResourceAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ResourceType)
  @JoinColumn({ name: 'resource_type_id' })
  resourceType: ResourceType;

  @Column({ name: 'action_name' })
  actionName: string;
}