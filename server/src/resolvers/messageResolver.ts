import { Arg, Resolver, Query, Int, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import { Message } from '../entity/Message';
import { MyContext } from '../types';
import { authChecker } from '../middleware/authChecker';

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