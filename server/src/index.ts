import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { Message } from './entity/Message';
import { buildSchema } from 'type-graphql';
import { MessageResolver } from './resolvers/messageResolver';
import { UserResolver } from './resolvers/userResolver';

createConnection().then(async connection => {
  const user1 = new User();
  user1.username = 'test1';
  user1.password = 'test1';
  await connection.manager.save(user1);

  const user2 = new User();
  user2.username = 'test2';
  user2.password = 'test2';
  await connection.manager.save(user2);

  console.log('users has been saved');

  //adding message from user to chat room
  const message = new Message();
  message.text = 'hello world';
  message.user = user2;
  await connection.manager.save(message);

  const message2 = new Message();
  message2.text = 'hello world again';
  message2.user = user2;
  await connection.manager.save(message2);

  const message3 = new Message();
  message3.text = 'hello from user1';
  message3.user = user1;
  await connection.manager.save(message3);

  const userRead = await User.findOne(1);
  console.log(userRead);

  const userWithMessages = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .offset(0)  //alkupiste
    .limit(5) //määrä
    .select(['user.username', 'user.description'])
    .where('user.username = :username', { username: 'test2' })
    .leftJoinAndSelect('user.messages', 'message')
    .getOne();
  console.log(userWithMessages);
  /*const messageRead = await Message.find({ user: user2 });
  console.log(messageRead);*/

  const messageRead = await Message.findOne(1);
  console.log(messageRead);
  console.log('all done');

}).catch(error => console.log(error));

//messagen user eager pois, vaihdetaan resolverissa, info typeorm

void (async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MessageResolver, UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  void apolloServer.listen();
})();

/*
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
}).catch(e => {
  console.log(e);
});*/