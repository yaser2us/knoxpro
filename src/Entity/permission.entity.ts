import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @Column()
  resource: string;

  @Column()
  action: string;

  @Column('jsonb', { default: [] }) // JSON array for attribute-based access control
  attributes: string[];

  @CreateDateColumn()
  createdAt: Date;
}