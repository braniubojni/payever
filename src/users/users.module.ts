import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { HttpModule } from '@nestjs/axios';
import { FilesModule } from 'src/files/files.module';
import { BrokersModule } from 'src/brokers/brokers.module';

@Module({
  imports: [
    BrokersModule,
    HttpModule,
    FilesModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
