type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd'}` | number;

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'opkit-crm-dev-secret',
  expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as JwtExpiresIn,
};
