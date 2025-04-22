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
import { Role } from 'src/utlis/enum/user-role.enum';

@UseGuards(AuthGuard)
@Controller('')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('teacher/:teacherId/quiz')
  public createQuiz(
    @CurrentUser() teacher: { id: number },
    @Param('teacherId') teacherId: number,
    @Body() body: CreateQuizDto,
  ) {
    if (teacherId != teacher.id)
      throw new BadRequestException(ErrorMessages.user.user_id_invalid);
    return this.quizService.createQuiz(teacher.id, body);
  }

  @Get('student/:studentId/quiz')
  public getAllPublishedQuizzes(
    @Param('studentId') id: number,
    @CurrentUser() studentId: { id: number },
  ) {
    if (id != studentId.id)
      throw new BadRequestException(ErrorMessages.user.user_id_invalid);
    return this.quizService.getAllPublishedQuizzes(studentId.id);
  }

  @Get('quiz/:quizid')
  public getQuizById(
    @Param('quizid', ParseIntPipe) quizid: number,
    @CurrentUser() student: { id: number; role: Role },
  ) {
    return this.quizService.getQuizById(quizid, student);
  }

  @Get('teacher/:teacherId/quiz')
  public getAllQuizzesForTeacher(
    @Param('teacherId') teacherId: number,
    @CurrentUser() teacher: { id: number },
  ) {
    if (teacherId != teacher.id)
      throw new BadRequestException(ErrorMessages.user.user_id_invalid);
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
