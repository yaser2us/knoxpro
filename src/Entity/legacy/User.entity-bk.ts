import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export enum CommentKind {
  Comment = 'COMMENT',
  Message = 'MESSAGE',
  Note = 'NOTE',
}

export type IUser = Users;

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  public text!: string;

  @Column({
    type: 'enum',
    enum: CommentKind,
    nullable: false,
  })
  public kind!: CommentKind;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP',
  })
  public updatedAt!: Date;

  // @ManyToOne(() => Users, (item) => item.id)
  // @JoinColumn({
  //   name: 'created_by',
  // })
  // public createdBy!: IUsers;
}