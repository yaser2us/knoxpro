import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn, BeforeInsert } from 'typeorm';
import { MissionActivity } from './mission.activity.entity';

@Entity('bank')
export class Bank {
    @PrimaryGeneratedColumn() // 👈 This allows you to assign the ID auto
    id: string;

    @Column()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;
}
