export interface IUser {
  _id: string;
  email: string;
  password: string;
}

export interface IOneUser {
  user: IUser;
}

export interface IUserResponse {
  error?: string;
  user?: IUser;
}
