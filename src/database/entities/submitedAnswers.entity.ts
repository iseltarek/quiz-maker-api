/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './questions.entity';
import { Result } from './results.entity';

@Entity('submited-answers')
export class SubmittedAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentAnswer: string;

  @Column({ nullable: true })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.submittedAnswers)
  question: Question;

  @ManyToOne(() => Result, (result) => result.answers)
  result: Result;
}
