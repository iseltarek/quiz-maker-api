/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/gaurds/auth.guard';
import { QuizSubmissionService } from './quiz-submission.service';
import { QuizSubmissionDto } from './dtos/quiz-submission.dto';

@UseGuards(AuthGuard)
@Controller('')
export class QuizSubmissionController {
  constructor(private quizSubmissionService: QuizSubmissionService) {}

  @Post('student/:studentId/quiz/:quizId/submit')
  public submitQuizAnswers(
    @Param('studentId') studentId: number,
    @Param('quizId') quizId: number,
    @Body() quizSubmission: QuizSubmissionDto[],
  ) {
    if (quizSubmission.length === 0)
      throw new BadRequestException('answers should be provided');
    return this.quizSubmissionService.submitQuizAnswers(
      studentId,
      quizId,
      quizSubmission,
    );
  }
}
