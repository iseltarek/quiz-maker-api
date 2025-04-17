/* eslint-disable prettier/prettier */
import { QuestionType } from 'src/utlis/enum/question-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

interface QuestionOption {
  id: string;
  text: string;
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionText: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column('simple-json')
  options: QuestionOption[];

  @Column()
  correct_answer: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;
}
