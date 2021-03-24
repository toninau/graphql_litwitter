import {
  Arg,
  Resolver,
  Query,
  Int,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';

import { authChecker } from '../middleware/authChecker';
import { MyContext } from '../types';
import { User } from '../entity/User';
import { registerValidation } from '../utils/registerValidation';
import { Follow } from '../entity/Follow';

import config from '../utils/config';

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

@ObjectType()
class UserWithExtra extends User {
  @Field(() => Int)
  followsCount!: number;
  @Field(() => Int)
  followersCount!: number;
  @Field()
  following!: boolean;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => UserWithExtra, { nullable: true })
  async user(
    @Arg('id', () => Int, { nullable: true }) id: number,
    @Arg('username', () => String, { nullable: true }) username: string,
    @Ctx() { currentUser }: MyContext
  ): Promise<UserWithExtra | undefined> {

    const { string, value } = id ?
      { string: 'user.id = :id', value: { id } } :
      { string: 'user.username = :username', value: { username } };

    // Check if currentUser is following user
    let following = false;
    if (currentUser) {
      const follows = await Follow
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.followsTo', 'user')
        .where('follow.follower = :id', { id: currentUser.id })
        .getMany();

      following = follows.some((follow) => follow.followsTo.id === id ||
        follow.followsTo.username === username);
    }

    const result = await User
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.followsCount', 'user.follows')
      .loadRelationCountAndMap('user.followersCount', 'user.followers')
      .where(string, value)
      .getOne();

    const userToReturn = ({
      ...result,
      following
    } as UserWithExtra);

    return userToReturn;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(authChecker)
  me(@Ctx() { currentUser }: MyContext): Promise<User | undefined> {
    return User.findOne(currentUser.id);
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(authChecker)
  async updateUser(
    @Arg('description', { nullable: true }) description: string,
    @Arg('name', { nullable: true }) name: string,
    @Ctx() { currentUser }: MyContext
  ): Promise<User> {
    const result = await User
      .createQueryBuilder()
      .update(User)
      .set({ description, name })
      .where('id = :id', { id: currentUser.id })
      .returning('*')
      .execute();
    const user = (result.raw as User[]);
    return (user[0]);
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

    let user;
    try {
      const userToCreate = User.create({
        username: options.username,
        name: options.username,
        password: hashedPassword
      });
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
      value: sign(userForToken, config.SECRET)
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
      value: sign(userForToken, config.SECRET)
    };
  }
}