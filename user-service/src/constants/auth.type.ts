interface AuthInfo {
  access_token: string;
  decodeAccessToken: {
    user_id: number;
    username: string;
    email: string;
    iat: number;
    exp: number;
  };
}
