import { Arg, Resolver, Query, Int } from 'type-graphql';
import { User } from '../entity/User';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  user(
    @Arg('id', () => Int, { nullable: true }) id: number,
    @Arg('username', { nullable: true }) username: string
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
}

/*Messagesta field resolveri jolle paginointi */