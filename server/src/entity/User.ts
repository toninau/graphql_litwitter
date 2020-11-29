import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './Message';
import { Follow } from './Follow';

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
  @Column({ length: 14, nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ length: 280, nullable: true })
  description?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @Column()
  password!: string;

  @OneToMany(() => Message, message => message.user)
  messages!: Message[];

  @OneToMany(() => Follow, follow => follow.follower)
  follows!: Follow[];

  @OneToMany(() => Follow, follow => follow.followsTo)
  followers!: Follow[];
}