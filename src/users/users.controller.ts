import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/')
  async createUser(@Body() dto: UserDto) {
    try {
      return await this.userService.createUser(dto);
    } catch (error) {
      Logger.error(error);
    }
  }

  @Post(':userId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string,
  ) {
    return await this.userService.saveAvatar(file, userId);
  }

  @Delete(':userId/avatar')
  async rmAvatar(@Param('userId') userId: string) {
    return await this.userService.deleteAvatar(userId);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    try {
      await this.userService.findUser(userId);
    } catch (error) {
      Logger.error(error);
    }
  }
}
