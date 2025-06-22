// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { User } from './user.entity';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Profile Entity
@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_image' })
    profileImage: string;

    @Column({ type: 'varchar', length: 100, name: 'first_name' })
    firstName: string;

    @Column({ type: 'varchar', length: 100, name: 'last_name' })
    lastName: string;

    @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
    dateOfBirth: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    country: string;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true
    })
    gender: Gender;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'zip_code' })
    zipCode: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    timezone: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    locale: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    // Relationships
    @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    // Timestamps
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
