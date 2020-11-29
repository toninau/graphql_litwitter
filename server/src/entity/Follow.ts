import { ObjectType, Field } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Follow extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.follows)
  follower!: User;

  @Field(() => User)
  @ManyToOne(() => User, user => user.followers)
  followsTo!: User;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  followedAt!: Date;
}