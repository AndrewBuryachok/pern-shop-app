import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { MarketTag } from './market-tag.entity';

@Entity('markets_tags_states')
export class MarketTagState extends State {
  @Column({ name: 'market_tag_id' })
  marketTagId: number;

  @ManyToOne(() => MarketTag, { nullable: false })
  @JoinColumn({ name: 'market_tag_id' })
  marketTag: MarketTag;
}
