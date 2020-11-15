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

export type Message = {
  id: number;
  text: string;
  createdAt: string;
  user: {
    username: string;
    name: string;
  }
};