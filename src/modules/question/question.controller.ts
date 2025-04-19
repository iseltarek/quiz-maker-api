/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from '../auth/gaurds/auth.guard';
import { CreateQuestionDto } from './dtos/create-question.dto';

@UseGuards(AuthGuard)
@Controller('')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('teacher/:teacherId/quiz/:quizId/question')
  private createOneQuestion(
    @Param('teacherId') teacherId: number,
    @Param('quizId') quizId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.createOneQuestion(
      teacherId,
      quizId,
      createQuestionDto,
    );
  }

  @Post('teacher/:teacherId/quiz/:quizId/question/bulk')
  private createManyQuestions(
    @Param('teacherId') teacherId: number,
    @Param('quizId') quizId: number,
    @Body() createQuestionDto: CreateQuestionDto[],
  ) {
    return this.questionService.createManyQuestions(
      teacherId,
      quizId,
      createQuestionDto,
    );
  }
  @Get('quiz/:quizId/questions')
  private getAllQuestions(@Param('quizId') quizId: number) {
    return this.questionService.getAllQuizQuestions(quizId);
  }

  @Get('quiz/:quizId/questions/:questionId')
  private getQuestionById(
    @Param('quizId') quizId: number,
    @Param('questionId') questionId: number,
  ) {
    return this.questionService.getQuestionById(questionId);
  }

  @Delete('teacher/:teacherId/quiz/:quizId/question/:questionId')
  private deleteQuestionById(
    @Param('teacherId') teacherId: number,
    @Param('quizId') quizId: number,
    @Param('questionId') questionId: number,
  ) {
    return this.questionService.deleteQuestionById(
      teacherId,
      quizId,
      questionId,
    );
  }
}
