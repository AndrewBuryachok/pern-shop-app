import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Haulage } from '../haulages/haulage.entity';
import { Hire } from '../hires/hire.entity';
import { Bargain } from '../bargains/bargain.entity';

@Entity('shops_deliveries')
export class ShopDelivery extends Haulage {
  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

  @Column({ name: 'bargain_id' })
  bargainId: number;

  @OneToOne(() => Bargain, { nullable: false })
  @JoinColumn({ name: 'bargain_id' })
  bargain: Bargain;
}
