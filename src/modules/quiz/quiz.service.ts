/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/database/entities/quiz.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/database/entities/users.entity';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { ErrorMessages } from 'src/utlis/common/errorMessages';
import { Role } from 'src/utlis/enum/user-role.enum';
import { Question } from 'src/database/entities/questions.entity';
import { QuizResponseDto } from './dtos/quizResponse.dto';
import { Result } from 'src/database/entities/results.entity';
@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  public async createQuiz(teacherId: number, createQuizDto: CreateQuizDto) {
    const teacher = await this.validateUserRole(teacherId, Role.TEACHER);

    const { title, duration, startAt, description, questions } = createQuizDto;
    if (questions.length > 20 || questions.length < 2)
      throw new BadRequestException(ErrorMessages.quiz.questions);

    const createdQuestions = questions.map((question) =>
      this.questionRepository.create({
        ...question,
        createdBy: { id: teacher.id },
        quiz: null,
      }),
    );
    await this.questionRepository.save(createdQuestions);

    const newQuiz = this.quizRepository.create({
      title,
      duration,
      description,
      questions,
      startAt,
      is_published: false,
      createdBy: { id: teacher.id, username: teacher.username },
    });

    const savedQuiz = await this.quizRepository.save(newQuiz);

    return {
      id: savedQuiz.id,
      title: savedQuiz.title,
      duration: savedQuiz.duration,
      description: savedQuiz.description,
      is_published: savedQuiz.is_published,
      createdBy: savedQuiz.createdBy.id,
      createdAt: savedQuiz.createdAt,
      questions: savedQuiz.questions,
      startAt: savedQuiz.startAt,
    };
  }

  public async getAllPublishedQuizzes(
    userId: number,
  ): Promise<QuizResponseDto[]> {
    await this.validateUserRole(userId, Role.STUDENT);

    const quizzes = await this.quizRepository.find({
      relations: ['createdBy'],
      select: {
        id: true,
        title: true,
        duration: true,
        startAt: true,
        is_published: true,
        questions: {
          id: true,
          text: true,
          type: true,
          options: true,
        },
        description: true,
        createdAt: true,
        createdBy: {
          id: true,
          username: true,
        },
      },
      order: {
        startAt: 'DESC',
      },
    });
    const now = new Date();
    quizzes.forEach((quiz) => {
      if (new Date(quiz.startAt) <= now) {
        quiz.is_published = true;
      }
    });
    return quizzes;
  }

  public async getAllQuizzesForTeacher(
    teacherId: number,
  ): Promise<QuizResponseDto[]> {
    const teacher = await this.validateUserRole(teacherId, Role.TEACHER);
    return this.quizRepository.find({
      where: {
        createdBy: { id: teacher.id },
      },
      select: {
        id: true,
        title: true,
        duration: true,
        description: true,
        createdAt: true,
        is_published: true,
      },
    });
  }

  public async deleteQuiz(teacherId: number, quizId: number) {
    await this.validateUserRole(teacherId, Role.TEACHER);
    const quiz = await this.quizRepository.findOne({
      where: {
        id: quizId,
        createdBy: { id: teacherId },
      },
      relations: ['createdBy'],
    });
    if (!quiz) throw new NotFoundException(ErrorMessages.quiz.invalid_quiz_id);

    await this.quizRepository.softDelete(quiz.id);

    return 'done';
  }

  public async getQuizById(
    quizId: number,
    student: { id: number; role: Role },
  ): Promise<QuizResponseDto> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['createdBy', 'questions'],
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        createdAt: true,
        startAt: true,
        createdBy: {
          id: true,
          username: true,
          role: true,
        },
        questions: {
          id: true,
          text: true,
          type: true,
          options: true,
        },
      },
    });
    if (!quiz) throw new NotFoundException(ErrorMessages.quiz.invalid_quiz_id);
    if (quiz.startAt > new Date())
      throw new UnauthorizedException(ErrorMessages.quiz.quiztime);

    const existingResult = await this.resultRepository.findOne({
      where: {
        student: { id: student.id },
        quiz: { id: quizId },
      },
    });
    if (existingResult) {
      throw new BadRequestException({
        message: 'You have already submitted this quiz.',
        score: existingResult.score,
        numberOfQuestions: quiz.questions.length,
        passed: existingResult.passed,
        submittedAt: existingResult.submittedAt,
      });
    }
    return quiz;
  }

  private async validateUserRole(
    userId: number,
    expectedRole: Role,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException(ErrorMessages.user.user_not_found);
    }
    if (user.role !== expectedRole) {
      throw new UnauthorizedException(ErrorMessages.permission.only_owner);
    }
    return user;
  }

  private async validateQuestionIds(
    questionIds: number[],
    teacherId: number,
  ): Promise<Question[]> {
    if (questionIds.length <= 0)
      throw new BadRequestException(ErrorMessages.quiz.questions);

    const questions = await this.questionRepository.find({
      where: { id: In(questionIds), createdBy: { id: teacherId } },
      relations: ['createdBy'],
    });

    if (!questions || questions.length !== questionIds.length) {
      throw new BadRequestException('question ids are invalid');
    }

    return questions;
  }
}
