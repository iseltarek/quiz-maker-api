/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from './users.entity';
import { SubmittedAnswer } from './submitedAnswers.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ default: false })
  passed: boolean;

  @CreateDateColumn('timestamp')
  submittedAt: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.results)
  student: User;

  @OneToMany(() => SubmittedAnswer, (answer) => answer.result)
  answers: SubmittedAnswer[];
}
