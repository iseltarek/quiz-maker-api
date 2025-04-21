/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './database/entities/quiz.entity';
import { Question } from './database/entities/questions.entity';
import { Result } from './database/entities/results.entity';
import { User } from './database/entities/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionModule } from './modules/question/question.module';
import { SubmittedAnswer } from './database/entities/submitedAnswers.entity';
import { QuizSubmissionModule } from './modules/quiz-submission/quiz-submission.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: '123',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'iseL2424#',
      database: 'quiz_maker',
      entities: [Quiz, User, Question, Result, SubmittedAnswer],
      synchronize: true,
    }),
    AuthModule,
    QuizModule,
    QuestionModule,
    QuizSubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
