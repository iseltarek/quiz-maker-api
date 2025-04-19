/* eslint-disable prettier/prettier */
import { IsNotEmpty } from '@nestjs/class-validator';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Title can be at most 50 characters' })
  title: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Duration must be a number (in minutes)' })
  duration: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @IsArray()
  @IsNotEmpty()
  questionsIds: number[];

  @IsBoolean()
  is_published: boolean = false;
}
