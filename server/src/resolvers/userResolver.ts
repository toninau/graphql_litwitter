import {
  Arg,
  Resolver,
  Query,
  Int,
  FieldResolver,
  Root,
  Mutation,
  InputType,
  Field,
  ObjectType
} from 'type-graphql';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';

import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { registerValidation } from '../utils/registerValidation';

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  value?: string;
}

const SECRET = process.env.SECRET || 'TEMP_VALUE';

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => [Message])
  async messages(
    @Root() user: User,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('offset', () => Int, { nullable: true }) offset: number
  ): Promise<Message[]> {

    const messages = await Message
      .createQueryBuilder('message')
      .offset(offset)
      .limit(limit)
      .leftJoinAndSelect('message.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany();

    return messages;
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg('id', () => Int, { nullable: true }) id: number,
    @Arg('username', () => String, { nullable: true }) username: string
  ): Promise<User | undefined> {
    return id ? User.findOne(id) : User.findOne({ where: { username } });
  }

  @Query(() => User)
  async userWithMessages(
    @Arg('username') username: string
  ): Promise<User | undefined> {

    const user = await User
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.description'])
      .leftJoinAndSelect('user.messages', 'message')
      .where('user.username = :username', { username })
      .getOne();

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const errors = registerValidation(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    const userToCreate = User.create({
      username: options.username,
      password: hashedPassword
    });
    let user;
    try {
      user = await User.save(userToCreate);
    } catch (err) {
      return {
        errors: [{
          field: 'username',
          message: 'username taken'

        }]
      };
    }

    const userForToken = {
      username: user.username,
      id: user.id
    };

    return {
      value: sign(userForToken, SECRET)
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username: options.username } });
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'username doesn\'t exist'
        }]
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'incorrect password'
        }]
      };
    }

    const userForToken = {
      username: user.username,
      id: user.id
    };

    return {
      value: sign(userForToken, SECRET)
    };
  }
}