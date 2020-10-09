import { UserAuthDto } from "./auth.models";

export interface JwtPayload {
  username: string;
}

export interface AccessToken {
  accessToken: string;
  user: UserAuthDto;
}