export type AccountValues = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  name?: string;
  description?: string;
  createdAt: string;
};

export type UserWithExtra = User & {
  followsCount: number;
  followersCount: number;
  following: boolean;
};

export type Message = {
  id: number;
  text: string;
  createdAt: string;
  user: {
    username: string;
    name: string;
  }
};

export interface MessageData {
  hasMore: boolean;
  messages: Array<Message>;
}

export type FollowsTo = {
  followedAt: string;
  followsTo: {
    name: string;
    username: string;
    id: number
  }
};

export type Follower = {
  followedAt: string;
  follower: {
    name: string;
    username: string;
    id: number
  }
};