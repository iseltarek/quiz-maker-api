/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  duration: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_published: boolean;

  @UpdateDateColumn()
  startedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.createdQuizzes)
  createdBy: User;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: Question[];

  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];
}
