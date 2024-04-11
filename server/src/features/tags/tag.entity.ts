import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
