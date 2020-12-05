import {
  Arg,
  Resolver,
  Query,
  Int,
  Mutation,
  Ctx,
  UseMiddleware,
  InputType,
  Field,
  ObjectType
} from 'type-graphql';
import { Max, Min } from 'class-validator';

import { authChecker } from '../middleware/authChecker';
import { Message } from '../entity/Message';
import { Follow } from '../entity/Follow';
import { MyContext } from '../types';

@InputType()
class OffsetLimitInput {
  @Field(() => Int, { defaultValue: 0, nullable: true })
  @Min(0)
  offset!: number;
  @Field(() => Int, { defaultValue: 10, nullable: true })
  @Max(10)
  limit!: number;
}

@ObjectType()
class PaginatedMessages {
  @Field(() => [Message])
  messages!: Message[];
  @Field()
  hasMore!: boolean;
}

@Resolver()
export class MessageResolver {
  @Query(() => Message, { nullable: true })
  message(@Arg('id', () => Int) id: number): Promise<Message | undefined> {
    return Message.findOne(id, { relations: ['user'] });
  }

  @Query(() => PaginatedMessages)
  async allMessages(
    @Arg('options', { validate: true, nullable: true, defaultValue: { offset: 0, limit: 10 } }) options: OffsetLimitInput
  ): Promise<PaginatedMessages> {

    // One more message is returned than needed,
    // to evaluate if more messages are available.
    const realLimit = options.limit + 1;

    const messages = await Message.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC'
      },
      skip: options.offset,
      take: realLimit
    });

    return {
      messages: messages.slice(0, options.limit),
      hasMore: realLimit === messages.length
    };
  }

  @Query(() => PaginatedMessages, { nullable: true })
  async followMessages(
    @Ctx() { currentUser }: MyContext,
    @Arg('options', { validate: true, nullable: true, defaultValue: { offset: 0, limit: 10 } }) options: OffsetLimitInput
  ): Promise<PaginatedMessages | undefined> {
    const realLimit = options.limit + 1;

    if (currentUser) {
      // Gets users that currentUser is following
      const followsTo = await Follow
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.followsTo', 'user')
        .where('follow.follower = :id', { id: currentUser.id })
        .getMany();

      // Gets followed users messages
      const messages = await Message
        .createQueryBuilder('message')
        .offset(options.offset)
        .limit(realLimit)
        .leftJoinAndSelect('message.user', 'user')
        .where('user.id IN (:...ids)', { ids: followsTo.map((follow) => follow.followsTo.id) })
        .orderBy('message.createdAt', 'DESC')
        .getMany();

      return {
        messages: messages.slice(0, options.limit),
        hasMore: realLimit === messages.length
      };
    }
    return undefined;
  }

  @Query(() => PaginatedMessages)
  async messages(
    @Arg('id', () => Int, { nullable: true }) id: number,
    @Arg('username', () => String, { nullable: true }) username: string,
    @Arg('options', { validate: true, nullable: true, defaultValue: { offset: 0, limit: 10 } }) options: OffsetLimitInput
  ): Promise<PaginatedMessages> {

    // One more message is returned than needed,
    // to evaluate if more messages are available.
    const realLimit = options.limit + 1;

    // Selects query where clause based on
    // if user id is given as an argument.
    const { string, value } = id ?
      { string: 'user.id = :id', value: { id } } :
      { string: 'user.username = :username', value: { username } };

    const messages = await Message
      .createQueryBuilder('message')
      .offset(options.offset)
      .limit(realLimit)
      .leftJoinAndSelect('message.user', 'user')
      .where(string, value)
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return {
      messages: messages.slice(0, options.limit),
      hasMore: realLimit === messages.length
    };
  }

  @Mutation(() => Message)
  @UseMiddleware(authChecker)
  async addMessage(
    @Arg('message') messageInput: string,
    @Ctx() { currentUser }: MyContext
  ): Promise<Message> {
    const message = Message.create({
      text: messageInput,
      user: currentUser
    });
    return await Message.save(message);
  }
}