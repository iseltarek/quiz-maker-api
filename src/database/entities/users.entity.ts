/* eslint-disable prettier/prettier */
import { Role } from 'src/utlis/enum/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Result } from './results.entity';
import { Quiz } from './quiz.entity';
import { Question } from './questions.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.createdBy)
  createdQuizzes: Quiz[];

  @OneToMany(() => Result, (result) => result.student)
  results: Result[];

  @OneToMany(() => Question, (question) => question.createdBy)
  createdQuestions: Question[];
}
