import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
