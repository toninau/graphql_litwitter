import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';
import { verify } from 'jsonwebtoken';

import { MessageResolver } from './resolvers/messageResolver';
import { UserResolver } from './resolvers/userResolver';

import { User } from './entity/User';
import { Message } from './entity/Message';

export interface Session {
  id: number;
  dateCreated: number;
  username: string;
  issued: number;
  expires: number;
}

const SECRET = process.env.SECRET || 'TEMP_VALUE';
const PORT = process.env.PORT || '4000';

const main = async () => {
  await createConnection();

  /*Testing values*/
  const user1 = User.create({
    username: 'test1',
    password: 'test1'
  });
  await User.save(user1);

  const user2 = User.create({
    username: 'test2',
    password: 'test2'
  });
  await User.save(user2);

  const message = Message.create({
    text: 'hello world',
    user: user1
  });
  await Message.save(message);

  const message2 = Message.create({
    text: 'hello world again',
    user: user2
  });
  await Message.save(message2);

  const message3 = Message.create({
    text: 'hello from user1',
    user: user1
  });
  await Message.save(message3);
  /*End of test values*/

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MessageResolver, UserResolver],
      validate: false
    }),
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = verify(
          auth.substring(7), SECRET
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const currentUser = await User.findOne(decodedToken.id);
        return { currentUser };
      }
      return null;
    }
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });

  app.listen(parseInt(PORT), () => {
    console.log(`Server ready at ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});