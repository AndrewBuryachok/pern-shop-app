import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Container } from '../containers/container.entity';
import { Market } from '../markets/market.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';

@Entity('stores')
export class Store extends Container {
  @Column({ name: 'market_id' })
  marketId: number;

  @ManyToOne(() => Market, { nullable: false })
  @JoinColumn({ name: 'market_id' })
  market: Market;

  @Column({ name: 'market_tag_id' })
  marketTagId: number;

  @ManyToOne(() => MarketTag, { nullable: false })
  @JoinColumn({ name: 'market_tag_id' })
  marketTag: MarketTag;
}
