import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CsvParser } from 'src/providers/csv-parser.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users API')
@Controller('users')
export class UsersController {
  /** Controller Constructor */
  constructor(private readonly usersService: UsersService) {}

  /** Create User */
  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ type: UserDto })
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return await this.usersService.createUser(body);
  }

  /** Delete User */
  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteById(@Param('_id') _id: string): Promise<UserDto> {
    const deletedUser = await this.usersService.deleteUser(_id);
    // If user was not deleted throw exception
    if (!deletedUser) {
      throw new NotFoundException(
        `User with id '${_id}' was not deleted. Please confirm _id parameterr is correct.`,
      );
    }
    // Retrieve deleted user
    return deletedUser;
  }

  /** Get All Users */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getAll(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    // If user was not retrieved throw exception.
    if (!users) {
      throw new NotFoundException(`Cannot get users.`);
    }
    // Retrieve user
    return users;
  }

  /** Get User By _id */
  @Get('/:_id')
  @ApiOperation({ summary: 'Find user by mongo object id' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getById(@Param('_id') _id: string): Promise<UserDto> {
    const user = await this.usersService.findByObjectId(_id);
    // If user was not retrieved throw exception.
    if (!user) {
      throw new NotFoundException(
        `User with id '${_id}' was not found. Please confirm _id parameter is correct.`,
      );
    }
    // Retrieve user
    return user;
  }

  /** Get User By username */
  @Get('/username/:username')
  @ApiOperation({ summary: 'Find user by username' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getByUsername(@Param('username') username: string): Promise<UserDto> {
    const user = await this.usersService.findByUserName(username);
    // If user was not retrieved throw exception.
    if (!user) {
      throw new NotFoundException(
        `User with username '${username}' was not found. Please confirm username parameter is correct.`,
      );
    }
    // Retrieve user
    return user;
  }

  /** Update User */
  @Patch('/update/:_id')
  @ApiOperation({ summary: 'Partially update a user' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async updateById(@Param('_id') _id: string, @Body() body: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.usersService.patchUser(_id, body);
    // If updatedUser was not retrieved throw exception.
    if (!updatedUser) {
      throw new NotFoundException(`User id '${_id}' not found.`);
    }
    // Retrieve updated user
    return updatedUser;
  }

  /** Search By Criteria*/
  @Post('search')
  @ApiOperation({
    summary: `Search a user by any combination of these fields: firstName, LastName, userName.`,
  })
  @ApiOkResponse({ type: SearchUserDto })
  @ApiNotFoundResponse()
  async search(@Body() searchCriteria: SearchUserDto): Promise<SearchUserDto[]> {
    const users = await this.usersService.search(searchCriteria);
    // in case we didn't find users throw not found exception.
    if (!users || (Array.isArray(users) && users.length === 0)) {
      throw new NotFoundException(`Users not found by provided criteria`);
    }
    // otherwise return users.
    return users;
  }

  /** Seeder */
  @Post('/seed-data')
  @ApiOperation({ summary: 'Load data from ./seed-data/users.csv into our mongo database' })
  async seedData(): Promise<object> {
    const users = await CsvParser.parse('seed-data/users.csv');
    let seededSuccesfully = true;
    // if we've an array and it is filled with data prooceed.
    if (Array.isArray(users) && users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        try {
          // create new user.
          await this.create(users[i]);
        } catch (e) {
          // in case any error happens highlight error
          seededSuccesfully = false;
        }
      }
    } else {
      // otherwise capture the error, probably missing data into file.
      seededSuccesfully = false;
    }
    // return json object.
    return {
      success: seededSuccesfully,
    };
  }
}
