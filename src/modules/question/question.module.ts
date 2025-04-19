/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Quiz } from 'src/database/entities/quiz.entity';
import { Question } from 'src/database/entities/questions.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Quiz, Question])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
