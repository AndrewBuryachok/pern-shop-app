import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Thing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: number;

  @Column()
  description: string;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

export abstract class ThingWithAmount extends Thing {
  @Column({ name: 'amount_now' })
  amountNow: number;

  @Column({ name: 'amount_all' })
  amountAll: number;

  @Column()
  intake: number;

  @Column()
  kit: number;
}
