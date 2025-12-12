import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Item } from '../things/item.enum';

@Entity('orders')
export class Order extends Transportation {
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
}
