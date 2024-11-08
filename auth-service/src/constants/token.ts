export const nameTokenError = {
  TokenExpiredError: 'TokenExpiredError',
  JsonWebTokenError: 'JsonWebTokenError',
};

export interface TokenPayload {
  user_id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthInfo {
  access_token: string;
  decodeAccessToken: TokenPayload;
}
