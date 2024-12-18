import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';
import { Hire } from '../hires/hire.entity';
import { Trade } from '../trades/trade.entity';

@Entity('markets_deliveries')
export class MarketDelivery extends Delivery {
  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

  @Column({ name: 'trade_id' })
  tradeId: number;

  @OneToOne(() => Trade, { nullable: false })
  @JoinColumn({ name: 'trade_id' })
  trade: Trade;
}
