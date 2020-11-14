export type AccountValues = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  description: string;
};

export type Message = {
  id: number;
  text: string;
  user: {
    username: string;
  }
};