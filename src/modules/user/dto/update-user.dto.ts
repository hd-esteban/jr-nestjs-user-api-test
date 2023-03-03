import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// There is no need to change this DTO as it is Partial Type based on the CreateUserDto.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
