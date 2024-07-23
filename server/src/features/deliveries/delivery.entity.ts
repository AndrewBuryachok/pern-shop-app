import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Hire } from '../hires/hire.entity';

@Entity('deliveries')
export class Delivery extends Transportation {
  @Column({ name: 'from_hire_id' })
  fromHireId: number;

  @OneToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'from_hire_id' })
  fromHire: Hire;

  @Column({ name: 'to_hire_id' })
  toHireId: number;

  @OneToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'to_hire_id' })
  toHire: Hire;
}
