/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QuizSubmissionService } from './quiz-submission.service';
import { QuizSubmissionController } from './quiz-submission.controller';
import { Question } from 'src/database/entities/questions.entity';
import { User } from 'src/database/entities/users.entity';
import { Quiz } from 'src/database/entities/quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from 'src/database/entities/results.entity';
import { SubmittedAnswer } from 'src/database/entities/submitedAnswers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Quiz, Question, Result, SubmittedAnswer]),
  ],
  providers: [QuizSubmissionService],
  controllers: [QuizSubmissionController],
})
export class QuizSubmissionModule {}
