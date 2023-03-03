import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
export class SearchUserDto extends PickType(PartialType(CreateUserDto), [
  'firstName',
  'lastName',
  'username',
  'email', // I added this just to allow seach to search through email too.
] as const) {}
