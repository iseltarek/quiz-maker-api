/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './questions.entity';
import { Result } from './results.entity';
import { User } from './users.entity';

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  duration_minutes: number;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ default: false })
  is_published: boolean;

  @UpdateDateColumn()
  startedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];

  @ManyToOne(() => User, (user) => user.createdQuizzes)
  createdBy: User;
}
