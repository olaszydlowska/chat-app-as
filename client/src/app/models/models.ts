export enum Action {
  JOINED = 0,
  LEFT = 1,
  MESSAGE = 2,
}

export interface User {
  Id: number;
  Name: string;
}

export interface Message {
  User: User;
  MessageContent?: string;
  Action?: Action;
}
