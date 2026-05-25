import jwt, { SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXP     = (process.env.JWT_ACCESS_EXPIRES  || '15m') as SignOptions['expiresIn'];
const REFRESH_EXP    = (process.env.JWT_REFRESH_EXPIRES || '7d')  as SignOptions['expiresIn'];

export interface JwtPayload {
  sub: number;          // user id
  email: string;
  role: string;
  tenantId: number;
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, ACCESS_SECRET) as unknown as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, REFRESH_SECRET) as unknown as JwtPayload;
