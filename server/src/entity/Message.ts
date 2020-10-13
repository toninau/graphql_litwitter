import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Message extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column({ length: 280 })
  text!: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.messages)
  user!: User;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}