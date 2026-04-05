import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'opkit_crm backend';
  }
}

