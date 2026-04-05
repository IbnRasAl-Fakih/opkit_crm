export type AuthMode = 'signin' | 'signup';

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginResponse {
  accessToken: string;
}
