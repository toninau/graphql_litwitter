import { Arg, Ctx, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware, Field } from 'type-graphql';
import { Follow } from '../entity/Follow';
import { User } from '../entity/User';
import { authChecker } from '../middleware/authChecker';
import { MyContext } from '../types';

@ObjectType()
class FollowFollowsTo {
  @Field(() => User)
  followsTo!: User;
  @Field()
  followedAt!: Date;
}

@ObjectType()
class FollowFollowers {
  @Field(() => User)
  follower!: User;
  @Field()
  followedAt!: Date;
}

@Resolver(() => Follow)
export class FollowResolver {

  @Query(() => [FollowFollowsTo])
  async followsTo(
    @Arg('id', () => Int) id: number
  ): Promise<Follow[]> {
    const followsTo = await Follow
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.followsTo', 'user')
      .where('follow.follower = :id', { id })
      .getMany();
    return followsTo;
  }

  @Query(() => [FollowFollowers])
  async followers(
    @Arg('id', () => Int) id: number
  ): Promise<Follow[]> {
    const followers = await Follow
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'user')
      .where('follow.followsTo = :id', { id: id })
      .getMany();
    return followers;
  }

  @Mutation(() => Follow, { nullable: true })
  @UseMiddleware(authChecker)
  async followUser(
    @Arg('id', () => Int) id: number,
    @Ctx() { currentUser }: MyContext
  ): Promise<Follow | undefined> {
    const followedUser = await User.findOne(id);
    const followsTo = await Follow
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.followsTo', 'user')
      .where('follow.follower = :id', { id: currentUser.id })
      .getMany();

    if (followedUser && followedUser.id !== currentUser.id &&
      !followsTo.some((follow) => follow.followsTo.id === id)) {
      const follow = Follow.create({
        follower: currentUser,
        followsTo: followedUser
      });
      return await Follow.save(follow);
    }
    return undefined;
  }
}