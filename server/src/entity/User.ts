import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Message } from './Message';

@ObjectType()
@Entity()
export class User extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field()
  @Column({ unique: true, length: 14 })
  username!: string;

  @Field({ nullable: true })
  @Column({ length: 140, nullable: true })
  description?: string;

  @Column()
  password!: string;

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.user)
  messages!: Message[];
}