import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { Good } from '../goods/good.entity';
import { Ware } from '../wares/ware.entity';
import { Product } from '../products/product.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column({ name: 'good_id', nullable: true })
  goodId: number;

  @ManyToOne(() => Good, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'good_id' })
  good: Good;

  @Column({ name: 'ware_id', nullable: true })
  wareId: number;

  @ManyToOne(() => Ware, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ware_id' })
  ware: Ware;

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  rate?: number;

  @OneToMany(() => Delivery, (delivery) => delivery.purchase)
  deliveries: Delivery[];
}
