import { Arg, Resolver, Query, Int, /* Mutation */ } from 'type-graphql';
import { Message } from '../entity/Message';
/* import { User } from '../entity/User'; */

@Resolver()
export class MessageResolver {

  @Query(() => Message, { nullable: true })
  message(@Arg('id', () => Int) id: number): Promise<Message | undefined> {
    return Message.findOne(id, { relations: ['user'] });
  }

  @Query(() => [Message])
  async messages(@Arg('userId', () => Int) userId: number): Promise<Message[]> {
    const messages = await Message.find({
      relations: ['user'],
      where: {
        user: {
          id: userId
        }
      }
    });
    return messages;
  }

  /* @Mutation(() => Message)
  async addMessage(
    @Arg('message') messageInput: string,
    @Arg('user') user : User
  ): Promise<Message> {
    const message = Message.create({
      text: messageInput,
      user
    });
    return await Message.save(message);
  } */
}