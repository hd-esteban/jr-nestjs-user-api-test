import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGO_DB_NAME } from './constants';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDoc } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  /**Service Constructor */
  constructor(@InjectModel(User.name, MONGO_DB_NAME) private userModel: Model<UserDoc>) {}

  /** Create User */
  async createUser(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  /** Delete User By Object Id */
  async deleteUser(_id: string): Promise<User> {
    try {
      const user = await this.userModel.findOneAndDelete({ _id });
      return user;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  /** Find By Object Id */
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }
  /** Find By Object Id */
  async findByObjectId(_id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(_id);
      return user;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  /** Find By 'username' Field */
  async findByUserName(username: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        username,
      });
      return user;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  /** Partial Patch */
  async patchUser(_id: string, user: UpdateUserDto): Promise<User> {
    try {
      const userUpdated = await this.userModel.findByIdAndUpdate(_id, user, {
        returnOriginal: false,
      });
      return userUpdated;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  /** Search By Criteria */
  async search(searchCriteria: SearchUserDto): Promise<User[]> {
    try {
      const users = await this.userModel.find(searchCriteria);
      return users;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }
}
