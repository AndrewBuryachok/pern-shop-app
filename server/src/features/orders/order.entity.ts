import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Hire } from '../hires/hire.entity';

@Entity('orders')
export class Order extends Transportation {
  @Column({ name: 'hire_id' })
  hireId: number;

  @OneToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;
}
