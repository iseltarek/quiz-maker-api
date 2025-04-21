/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QuizSubmissionDto } from './dtos/quiz-submission.dto';
import { Result } from 'src/database/entities/results.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Quiz } from 'src/database/entities/quiz.entity';
import { Question } from 'src/database/entities/questions.entity';
import { In, Repository } from 'typeorm';
import { SubmittedAnswer } from 'src/database/entities/submitedAnswers.entity';
import { Role } from 'src/utlis/enum/user-role.enum';
import { ErrorMessages } from 'src/utlis/common/errorMessages';
import { QuestionType } from 'src/utlis/enum/question-type.enum';

@Injectable()
export class QuizSubmissionService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(SubmittedAnswer)
    private submittedAnswerRepository: Repository<SubmittedAnswer>,
  ) {}

  public async submitQuizAnswers(
    studentId: number,
    quizId: number,
    quizSubmission: QuizSubmissionDto[],
  ) {
    const student = await this.validateStudent(studentId);
    const quiz = await this.validateQuiz(quizId);
    const submittedQuestionIds = quizSubmission.map((s) => s.questionId);
    this.validateQuestionsInQuiz(quiz, submittedQuestionIds);

    const questions = await this.questionRepository.find({
      where: { id: In(submittedQuestionIds) },
    });
    const result = this.resultRepository.create({
      student,
      quiz,
      submittedAt: new Date(),
      score: 0,
    });
    const savedResult = await this.resultRepository.save(result);

    let totalScore = 0;
    const savedAnswers = await Promise.all(
      quizSubmission.map(async (submission) => {
        const submissionQuestion = questions.find(
          (q) => q.id === submission.questionId,
        );

        const isCorrect = this.calculateResults(
          submission.answer,
          submissionQuestion!.correctAnswer,
          submission.questionType,
        );

        if (isCorrect) totalScore++;

        const answer = this.submittedAnswerRepository.create({
          studentAnswer: submission.answer,
          isCorrect,
          question: submissionQuestion,
        });
        return this.submittedAnswerRepository.save(answer);
      }),
    );

    savedResult.score = totalScore;
    savedResult.answers = savedAnswers;
    savedResult.passed = totalScore >= Math.ceil(quiz.questions.length / 2);
    await this.resultRepository.save(savedResult);
    return {
      score: savedResult.score,
      passed: savedResult.passed,
    };
  }

  private calculateResults(
    studentAnswer: string,
    correctAnswer: string,
    questionType: QuestionType,
  ) {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return studentAnswer === correctAnswer;
      case QuestionType.TEXT:
        return (
          studentAnswer.trim().toLowerCase() ===
          correctAnswer.toString().trim().toLowerCase()
        );
      default:
        return false;
    }
  }

  private async validateStudent(studentId: number): Promise<User> {
    const student = await this.userRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new UnauthorizedException(ErrorMessages.user.user_not_found);
    }
    if (student.role !== Role.STUDENT) {
      throw new UnauthorizedException(ErrorMessages.permission.only_owner);
    }
    return student;
  }

  private async validateQuiz(quizId: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz) throw new NotFoundException(ErrorMessages.quiz.invalid_quiz_id);
    return quiz;
  }
  private validateQuestionsInQuiz(quiz: Quiz, questionsIds: number[]) {
    const quizQuestionIds = quiz.questions.map((q) => q.id);

    const allValid = questionsIds.every((id) => quizQuestionIds.includes(id));
    if (!allValid)
      throw new NotFoundException(ErrorMessages.quiz.questionsNotvalid);
  }
}
