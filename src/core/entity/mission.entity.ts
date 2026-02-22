import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn, BeforeInsert } from 'typeorm';
import { MissionActivity } from './mission.activity.entity';

@Entity('mission')
export class Mission {
    @PrimaryGeneratedColumn() // 👈 This allows you to assign the ID auto
    id: string;

    @Column()
    name: string;

    @OneToMany(() => MissionActivity, activity => activity.mission)
    activities: MissionActivity[];
}
