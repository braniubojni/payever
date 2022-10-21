import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

interface IConfs {
  user: string;
  password: string;
  host: string;
  queueName: string;
}

export const getRabbitConfig = (
  configService: ConfigService,
): DynamicModule => {
  return getRabbitConfs(configService);
};

const getRabbitConfs = (configService: ConfigService): DynamicModule => {
  return ClientsModule.register([
    {
      name: 'rabbit-mq-module',
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${configService.get('RABBITMQ_USER')}:${configService.get(
            'RABBITMQ_PASSWORD',
          )}@${configService.get('RABBITMQ_HOST')}`,
        ],
        queue: configService.get('RABBITMQ_QUEUE_NAME'),
        queueOptions: {
          durable: true,
        },
      },
    },
  ]);
};
