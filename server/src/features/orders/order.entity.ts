import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Cell } from '../cells/cell.entity';
import { Card } from '../cards/card.entity';

@Entity('orders')
export class Order extends Transportation {
  @Column({ name: 'cell_id' })
  cellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'cell_id' })
  cell: Cell;

  @Column({ name: 'customer_card_id' })
  customerCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'customer_card_id' })
  customerCard: Card;
}
