import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getRabbitConfig } from 'src/configs/rabbit.config';
import { BrokersService } from './brokers.service';

@Module({
  providers: [BrokersService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${'.' + process.env.NODE_ENV || ''}`,
    }),
    getRabbitConfig(new ConfigService()),
  ],
  exports: [BrokersService],
})
export class BrokersModule {}
