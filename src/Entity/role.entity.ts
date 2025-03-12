import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  name: string;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' }) // Role inheritance
  parentRole: Role;

  @CreateDateColumn()
  createdAt: Date;
}
