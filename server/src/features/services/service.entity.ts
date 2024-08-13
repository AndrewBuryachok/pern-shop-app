import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
