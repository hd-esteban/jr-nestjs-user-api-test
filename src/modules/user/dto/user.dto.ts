import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserDto extends User {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  password: string;

  @ApiResponseProperty()
  updatedAt: string;

  @ApiResponseProperty()
  username: string;

  constructor(args?: Partial<UserDto>) {
    super();
    Object.assign(this, args);
  }
}
