import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity('resource_types')
export class ResourceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column()
  name: string;
}