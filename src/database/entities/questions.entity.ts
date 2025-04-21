/* eslint-disable prettier/prettier */
import { QuestionType } from 'src/utlis/enum/question-type.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { SubmittedAnswer } from './submitedAnswers.entity';
import { User } from './users.entity';
import { QuestionOption } from 'src/utlis/common/questionOption.interface';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column('simple-json', { nullable: true })
  options: QuestionOption[] | null;

  @Column()
  correctAnswer: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz | null;

  @OneToMany(() => SubmittedAnswer, (submitted) => submitted.question)
  submittedAnswers: SubmittedAnswer[];

  @ManyToOne(() => User, (user) => user.createdQuestions)
  createdBy: User;
}
