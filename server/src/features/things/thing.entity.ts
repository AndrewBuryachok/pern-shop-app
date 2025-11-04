import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.enum';

export abstract class Thing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Item })
  item: Item;

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
