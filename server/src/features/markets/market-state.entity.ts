import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { Market } from './market.entity';

@Entity('markets_states')
export class MarketState extends State {
  @Column({ name: 'market_id' })
  marketId: number;

  @ManyToOne(() => Market, { nullable: false })
  @JoinColumn({ name: 'market_id' })
  market: Market;
}
