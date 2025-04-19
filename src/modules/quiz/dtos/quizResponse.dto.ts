/* eslint-disable prettier/prettier */
import { QuestionResponseDto } from 'src/modules/question/dtos/questionResponse.dto';

export class QuizResponseDto {
  id: number;
  title: string;
  duration: number;
  describtion?: string;
  createdAt: Date;
  createdBy: {
    id: number;
    username: string;
  };
  questions: QuestionResponseDto[];
}
