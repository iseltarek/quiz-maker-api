/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
