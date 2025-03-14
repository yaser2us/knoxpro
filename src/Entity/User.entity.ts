import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: string;

  @Column({ default: false })
  isGlobalAdmin: boolean;  // True for ABC Admins

  @CreateDateColumn()
  createdAt: Date;
}
