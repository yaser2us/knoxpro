import { Entity, ManyToOne, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { Mission } from './mission.entity';

@Entity('MissionActivity')
export class MissionActivity {
    @PrimaryColumn() // 👈 This allows you to assign the ID manually
    id: string;

    @Column()
    name: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => Mission, mission => mission.activities, { eager: true })
    mission: Mission;
}