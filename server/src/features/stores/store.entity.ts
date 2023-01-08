import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Container } from '../containers/container.entity';
import { Market } from '../markets/market.entity';

@Entity('stores')
export class Store extends Container {
  @Column({ name: 'market_id' })
  marketId: number;

  @ManyToOne(() => Market, { nullable: false })
  @JoinColumn({ name: 'market_id' })
  market: Market;
}
