/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
  duration: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.createdQuizzes)
  createdBy: User;

  // @ManyToMany(() => Question)
  // @JoinTable()
  // questions: Question[];
  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];
  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];
}
