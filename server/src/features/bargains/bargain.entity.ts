import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';
import { Good } from '../goods/good.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('bargains')
export class Bargain extends Purchase {
  @Column({ name: 'good_id' })
  goodId: number;

  @ManyToOne(() => Good, { nullable: false })
  @JoinColumn({ name: 'good_id' })
  good: Good;

  @OneToMany(() => Delivery, (delivery) => delivery.bargain)
  deliveries: Delivery[];
}
