/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateQuestionDto } from 'src/modules/question/dtos/create-question.dto';

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

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsArray()
  @IsNotEmpty()
  questions: CreateQuestionDto[];

  @IsBoolean()
  is_published: boolean = false;
}
