/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/database/entities/questions.entity';
import { Quiz } from 'src/database/entities/quiz.entity';
import { User } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { Role } from 'src/utlis/enum/user-role.enum';
import { ErrorMessages } from 'src/utlis/common/errorMessages';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
  ) {}

  public async createOneQuestion(
    teacherId: number,
    createQuestionDto: CreateQuestionDto,
  ) {
    const teacher = await this.validateUserIsTeacher(teacherId);

    const newQuestion = this.questionRepository.create({
      ...createQuestionDto,
      quiz: null,
      createdBy: { id: teacher.id },
    });
    await this.questionRepository.save(newQuestion);

    return newQuestion;
  }

  public async createManyQuestions(
    teacherId: number,
    CreateQuestionDto: CreateQuestionDto[],
  ) {
    const teacher = await this.validateUserIsTeacher(teacherId);

    const questions = CreateQuestionDto.map((question) =>
      this.questionRepository.create({
        ...question,
        createdBy: { id: teacher.id },
        quiz: null,
      }),
    );
    return this.questionRepository.save(questions);
  }

  public async getAllQuizQuestions(quizId: number) {
    const quiz = await this.validateQuiz(quizId);
    return this.questionRepository.find({
      where: { quiz: { id: quiz.id } },
      select: {
        id: true,
        text: true,
        type: true,
        options: true,
        correctAnswer: false,
      },
    });
  }

  public async getQuestionById(questionId: number) {
    const question = this.questionRepository.findOneBy({ id: questionId });
    if (!question)
      throw new BadRequestException(ErrorMessages.quiz.invalid_quiz_id);
    return this.questionRepository.findBy({ id: questionId });
  }

  public async deleteQuestionById(teacherId: number, questionId: number) {
    const teacher = await this.validateUserIsTeacher(teacherId);
    const question = await this.questionRepository.findOne({
      where: {
        id: questionId,
        createdBy: { id: teacher.id },
      },
    });
    if (!question) throw new NotFoundException();

    await this.questionRepository.remove(question);

    return {
      success: true,
      message: 'Quiz deleted successfully',
    };
  }

  private async validateUserIsTeacher(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException(ErrorMessages.user.user_not_found);
    }
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException(ErrorMessages.permission.only_owner);
    }
    return user;
  }

  private async validateQuiz(quizId: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['createdBy'],
      select: {
        createdBy: {
          id: true,
        },
      },
    });

    if (!quiz)
      throw new BadRequestException(ErrorMessages.quiz.invalid_quiz_id);
    return quiz;
  }
}
