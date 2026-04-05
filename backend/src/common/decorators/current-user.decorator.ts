import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedRequestUser } from '../types/authenticated-request.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedRequestUser => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);

