import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Thing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: number;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  intake: number;

  @Column()
  kit: number;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;
}
