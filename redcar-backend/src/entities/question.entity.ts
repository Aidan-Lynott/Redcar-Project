import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  timestamp: string;

  @Column()
  question: string;

  @Column()
  domain: string;

  @Column()
  result: string;

}