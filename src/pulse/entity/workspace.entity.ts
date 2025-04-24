import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
