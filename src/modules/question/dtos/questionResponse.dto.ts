/* eslint-disable prettier/prettier */
import { QuestionOption } from 'src/utlis/common/questionOption.interface';
import { QuestionType } from 'src/utlis/enum/question-type.enum';

export class QuestionResponseDto {
  id: number;
  text: string;
  type: QuestionType;
  options: QuestionOption[] | null;
}
