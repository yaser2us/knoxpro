import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
// import { nanoid } from 'nanoid';

@Entity('yassernasser')
export class YasserNasser {
    @PrimaryColumn() // 👈 This allows you to assign the ID manually
    id: string;

    @Column()
    name: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @BeforeInsert()
    generateId() {
        this.id = "2" // this.id || `ws_${nanoid()}`;
    }
}
//