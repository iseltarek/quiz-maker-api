/* eslint-disable prettier/prettier */

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from '@nestjs/class-validator';
import { Role } from 'src/utlis/enum/user-role.enum';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password must be more than 6 charcters' })
  password: string;

  @IsEnum(Role, {
    message: `Invalid role. Valid options are: ${Object.values(Role).join(', ')}`,
  })
  role: Role;
}
