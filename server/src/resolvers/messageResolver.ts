import { Arg, Resolver, Query, Int } from 'type-graphql';
import { Message } from '../entity/Message';

@Resolver()
export class MessageResolver {

  @Query(() => Message, { nullable: true })
  message(@Arg('id', () => Int) id: number): Promise<Message | undefined> {
    return Message.findOne(id, { relations: ['user'] });
  }

  @Query(() => [Message])
  async messages(@Arg('userId', () => Int) userId: number): Promise<Message[] | undefined> {
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
}