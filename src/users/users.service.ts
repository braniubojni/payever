import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { BrokersService } from 'src/brokers/brokers.service';
import { FilesService } from 'src/files/files.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';
import {
  AVATAR_NOT_EXISTS,
  randSalt,
  USR_EXISTS,
  USR_NOT_EXISTS,
} from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly broker: BrokersService,
    private readonly files: FilesService,
    private readonly http: HttpService,
  ) {}

  async createUser({ email, password }: UserDto) {
    const exists = await this.userModel
      .findOne({
        email: email,
      })
      .exec();
    if (exists) throw new BadRequestException(USR_EXISTS);
    const salt = await genSalt(randSalt());
    const newUser = new this.userModel({
      email: email,
      passwordHash: await hash(password, salt),
    });
    await newUser.save();
    await this.broker.sendMQ([1, 2, 3], { cmd: 'sum' });
  }

  async findUser(userId: string) {
    const user = await this.http.axiosRef.get(
      `https://reqres.in/api/users/${userId}`,
    );
    console.log(user);
  }

  async saveAvatar(img: Express.Multer.File, userId: string) {
    const user = await this.userModel.findById({ _id: userId }).exec();
    if (!user) throw new BadRequestException(USR_NOT_EXISTS);

    if (!user.avatar) {
      const imgBase = await this.files.createFile(img, userId);
      user.avatar = imgBase;
      await user.save();
    }

    return user.avatar;
  }

  async deleteAvatar(userId: string) {
    const user = await this.userModel.findById({ _id: userId }).exec();
    if (!user) throw new BadRequestException(USR_NOT_EXISTS);
    if (!user.avatar) {
      throw new BadRequestException(AVATAR_NOT_EXISTS);
    }

    await this.files.removeFile(userId, user.avatar);
    user.avatar = '';
    await user.save();
  }
}
