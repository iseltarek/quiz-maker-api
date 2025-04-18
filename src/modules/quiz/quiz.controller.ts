/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/gaurds/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { QuizService } from './quiz.service';
import { ErrorMessages } from 'src/utlis/common/errorMessages';

@UseGuards(AuthGuard)
@Controller('')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('teacher/:teacherId/quiz')
  public createQuiz(
    @CurrentUser() teacher: { id: number },
    @Body() body: CreateQuizDto,
  ) {
    return this.quizService.createQuiz(teacher.id, body);
  }

  @Get('student/:studentId/quiz')
  public getAllPublishedQuizzes(
    @Param('studentId') id: number,
    @CurrentUser() student: { id: number },
  ) {
    if (id != student.id)
      throw new BadRequestException(ErrorMessages.auth.unauthorized);
    return this.quizService.getAllPublishedQuizzes(student.id);
  }

  @Get('quiz/:quizid')
  public getQuizById(@Param('quizid', ParseIntPipe) quizid: number) {
    return this.quizService.getQuizById(quizid);
  }

  @Get('teacher/:teacherId/quiz')
  public getAllQuizzesForTeacher(
    @Param('teachertId') id: number,
    @CurrentUser() teacher: { id: number },
  ) {
    if (id != teacher.id)
      throw new BadRequestException(ErrorMessages.auth.unauthorized);
    return this.quizService.getAllQuizzesForTeacher(teacher.id);
  }

  @Delete('teacher/:teacherId/quiz/:quizId')
  public deleteQuiz(
    @Param('teacherId') teacherId: number,
    @Param('quizId') quizId: number,
  ) {
    return this.quizService.deleteQuiz(teacherId, quizId);
  }
}

// Teacher
//

// Quiz - CRUD
// :id teacher
// validate token teacher
// single / all - pagination (limit page skip)
// Student" CRUD
//
