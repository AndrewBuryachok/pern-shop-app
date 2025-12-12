import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Hire } from '../hires/hire.entity';
import { Item } from '../things/item.enum';

@Entity('orders')
export class Order extends Transportation {
  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

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
