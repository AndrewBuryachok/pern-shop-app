import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Stall } from '../stalls/stall.entity';
import { Good } from '../goods/good.entity';

@Entity('rents')
export class Rent extends Receipt {
  @Column({ name: 'stall_id' })
  stallId: number;

  @ManyToOne(() => Stall, { nullable: false })
  @JoinColumn({ name: 'stall_id' })
  stall: Stall;

  @OneToMany(() => Good, (good) => good.rent)
  goods: Good[];
}
