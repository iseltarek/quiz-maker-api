/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Quiz } from 'src/database/entities/quiz.entity';
import { Question } from 'src/database/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Quiz, Question])],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
