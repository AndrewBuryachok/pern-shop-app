import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Service } from '../services/service.entity';
import { Card } from '../cards/card.entity';

@Entity('adverts')
export class Advert extends Service {
  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;
}
