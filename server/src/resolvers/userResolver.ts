import { Arg, Resolver, Query, Int, FieldResolver, Root } from 'type-graphql';
import { Message } from '../entity/Message';
import { User } from '../entity/User';

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => Message)
  async messages(
    @Root() user: User,
    @Arg('limit', () => Int, { nullable: true }) limit: number,
    @Arg('offset', () => Int, { nullable: true }) offset: number
  ): Promise<Message[] | undefined> {

    const messages = await Message
      .createQueryBuilder('message')
      .offset(offset)
      .limit(limit)
      .leftJoinAndSelect('message.user', 'user')
      .where('user.username = :username', { username: user.username })
      .getMany();

    return messages;
  }

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