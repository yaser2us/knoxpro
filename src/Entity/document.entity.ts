import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  racingCode: string;

  @Column()
  animalName: string;

  @Column({ nullable: true })
  brandOrMicrochip: string;

  @Column()
  sampleDate: Date;

  @Column()
  sampleTime: string; // e.g. "10:30 am"

  @Column()
  sampleType: 'Urine' | 'Saliva' | 'Blood' | 'Hair';

  @Column({ nullable: true })
  track: string;

  @Column({ nullable: true })
  club: string;

  @Column()
  raceNumber: string;

  @Column({ nullable: true })
  placeInRace: string;

  @Column()
  responsiblePersonName: string;

  @Column({ nullable: true })
  responsiblePersonRegNo: string;

  @Column()
  witnessTrainerName: string;

  @Column()
  witnessTrainerSignature: string;

  @Column()
  witnessControllerName: string;

  @Column()
  witnessControllerSignature: string;

  @CreateDateColumn()
  createdAt: Date;
}
