/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
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
@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  public async createQuiz(teacherId: number, createQuizDto: CreateQuizDto) {
    const teacher = await this.validateUserRole(teacherId, Role.TEACHER);

    const { title, duration, description, is_published, questionsIds } =
      createQuizDto;
    await this.validateQuestionIds(questionsIds);

    const newQuiz = this.quizRepository.create({
      title,
      duration,
      description,
      questions: questionsIds.map((id) => ({ id })),
      isPublished: is_published,
      createdBy: teacher,
    });
    await this.quizRepository.save(newQuiz);
    return newQuiz;
  }

  public async getAllPublishedQuizzes(userId: number) {
    await this.validateUserRole(userId, Role.STUDENT);
    return this.quizRepository.find({
      //   where: { isPublished: true },
    });
  }

  public async getAllQuizzesForTeacher(teacherId: number) {
    const teacher = await this.validateUserRole(teacherId, Role.TEACHER);
    return this.quizRepository.find({
      where: {
        createdBy: { id: teacher.id },
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
    });
    if (!quiz)
      throw new BadRequestException(ErrorMessages.quiz.invalid_quiz_id);

    await this.quizRepository.remove(quiz);

    return {
      success: true,
      message: 'Quiz deleted successfully',
    };
  }

  public async getQuizById(quizId: number) {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz)
      throw new BadRequestException(ErrorMessages.quiz.invalid_quiz_id);
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
  ): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: { id: In(questionIds) },
    });

    if (!questions || questions.length !== questionIds.length) {
      throw new BadRequestException('question ids are invalid.');
    }

    return questions;
  }
}
