/* eslint-disable prettier/prettier */
import { QuestionType } from 'src/utlis/enum/question-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { QuestionOption } from 'src/utlis/common/questionOption.interface';
import { Quiz } from './quiz.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column('simple-json', { nullable: true })
  options: QuestionOption[];

  @Column()
  correctAnswer: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;
  @ManyToOne(() => User, (user) => user.createdQuestions)
  createdBy: User;
}
