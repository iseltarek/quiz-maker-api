/* eslint-disable prettier/prettier */
import { QuestionType } from 'src/utlis/enum/question-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

interface QuestionOption {
  id: string;
  text: string;
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column('simple-json')
  options: QuestionOption[];

  @Column()
  correctAnswer: string;

  @ManyToOne(() => User, (user) => user.createdQuestions)
  createdBy: User;
}
