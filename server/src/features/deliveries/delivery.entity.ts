import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Cell } from '../cells/cell.entity';
import { Card } from '../cards/card.entity';
import { User } from '../users/user.entity';

@Entity('deliveries')
export class Delivery extends Transportation {
  @Column({ name: 'from_cell_id' })
  fromCellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'from_cell_id' })
  fromCell: Cell;

  @Column({ name: 'to_cell_id' })
  toCellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'to_cell_id' })
  toCell: Cell;

  @Column({ name: 'sender_card_id' })
  senderCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'sender_card_id' })
  senderCard: Card;

  @Column({ name: 'receiver_user_id' })
  receiverUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User;
}
