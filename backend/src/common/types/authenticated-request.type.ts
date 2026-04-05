import { Request } from 'express';

export interface AuthenticatedRequestUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedRequestUser;
}
