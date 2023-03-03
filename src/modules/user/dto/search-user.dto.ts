import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
//TODO: Investigate further about Open API / mapped types: https://docs.nestjs.com/openapi/mapped-types
export class SearchUserDto extends PickType(PartialType(CreateUserDto), [
  /* Using OmitType to discard fields is simpler but it could cause issues in the long term  
  Cases where private fields are added to the schema could cause issues if we don't add them here.
  May be better to indicate which values should be picked from the Users DTO */
  'firstName',
  'lastName',
  'username',
  'email', // I added this just to allow seach to search through email too.
] as const) {}
