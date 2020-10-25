import { User } from './entity/User';

export type MyContext = {
  currentUser: User;
};

export interface TokenInterface {
  username: string,
  id: string;
}