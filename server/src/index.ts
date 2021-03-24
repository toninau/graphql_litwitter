import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import path from 'path';

import { MessageResolver } from './resolvers/messageResolver';
import { UserResolver } from './resolvers/userResolver';
import { FollowResolver } from './resolvers/followResolver';

import { User } from './entity/User';
import { Follow } from './entity/Follow';
import { Message } from './entity/Message';
import { TokenInterface } from './types';

import config from './utils/config';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: config.URL,
    migrations: [path.join(__dirname, './migration/*')],
    entities: [User, Follow, Message]
  });

  await conn.runMigrations();

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors());
  app.get('/', (_req, res) => res.send('testing'));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [MessageResolver, UserResolver, FollowResolver],
      validate: false
    }),
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        try {
          const decodedToken = verify(
            auth.substring(7), config.SECRET
          );
          const currentUser = await User.findOne((decodedToken as TokenInterface).id);
          return { currentUser };
        } catch (err) {
          return null;
        }
      }
      return null;
    }
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });

  app.listen(parseInt(config.PORT), () => {
    console.log(`Server ready at ${config.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});