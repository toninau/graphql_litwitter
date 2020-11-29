import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cors from 'cors';
import { verify } from 'jsonwebtoken';

import { MessageResolver } from './resolvers/messageResolver';
import { UserResolver } from './resolvers/userResolver';
import { FollowResolver } from './resolvers/followResolver';

import { User } from './entity/User';
import { TokenInterface } from './types';

const SECRET = process.env.SECRET || 'TEMP_VALUE';
const PORT = process.env.PORT || '4000';

const main = async () => {
  await createConnection();

  // await conn.runMigrations();

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors());

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
            auth.substring(7), SECRET
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

  app.listen(parseInt(PORT), () => {
    console.log(`Server ready at ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});