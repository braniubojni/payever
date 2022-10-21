import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Injectable()
export class BrokersService {
  constructor(
    @Inject('rabbit-mq-module') private readonly client: ClientProxy,
  ) {}

  @MessagePattern('rabbit-mq-producer')
  async sendMQ(payload: number[], pattern: any) {
    console.log('Worked');
    const res = await this.client.send(pattern, payload).toPromise();
    console.log(res);
    return res;
  }
}
