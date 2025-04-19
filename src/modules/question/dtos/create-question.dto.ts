/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty } from '@nestjs/class-validator';
import { ArrayMaxSize } from 'class-validator';
import { QuestionOption } from 'src/utlis/common/questionOption.interface';
import { QuestionType } from 'src/utlis/enum/question-type.enum';

export class CreateQuestionDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsEnum(QuestionType, {
    message: 'type must be text,checkbox ,multiple_choice',
  })
  type: QuestionType;

  @ArrayMaxSize(4)
  options: QuestionOption[];

  @IsNotEmpty()
  correctAnswer: string;
}
