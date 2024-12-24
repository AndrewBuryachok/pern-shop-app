import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { Hire } from '../hires/hire.entity';
import { Bargain } from '../bargains/bargain.entity';
import { Trade } from '../trades/trade.entity';
import { Sale } from '../sales/sale.entity';
import { Status } from '../transportations/status.enum';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

  @Column({ name: 'bargain_id', nullable: true })
  bargainId: number;

  @OneToOne(() => Bargain, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bargain_id' })
  bargain: Bargain;

  @Column({ name: 'trade_id', nullable: true })
  tradeId: number;

  @OneToOne(() => Trade, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trade_id' })
  trade: Trade;

  @Column({ name: 'sale_id', nullable: true })
  saleId: number;

  @OneToOne(() => Sale, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;

  @Column({ name: 'executor_card_id', nullable: true })
  executorCardId?: number;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'executor_card_id' })
  executorCard?: Card;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  rate?: number;
}
