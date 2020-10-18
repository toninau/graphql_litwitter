import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-express';
import { MyContext } from '../types';

export const authChecker: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.currentUser) {
    throw new AuthenticationError('not authenticated');
  }
  return next();
};