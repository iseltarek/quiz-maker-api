/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { QuestionType } from 'src/utlis/enum/question-type.enum';

export class QuizSubmissionDto {
  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  questionType: QuestionType;
}
