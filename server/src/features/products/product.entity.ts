import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Cell } from '../cells/cell.entity';
import { Card } from '../cards/card.entity';

@Entity('products')
export class Product extends Thing {
  @Column({ name: 'cell_id' })
  cellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'cell_id' })
  cell: Cell;

  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;
}
