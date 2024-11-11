import { TokenPayload, User } from './types';

export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

export interface ErrorResponse {
  message: string;
  data?: {
    [key: string]: string;
  };
  status: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}

export interface AuthInfo {
  access_token: string;
  decodeAccessToken: TokenPayload;
}
