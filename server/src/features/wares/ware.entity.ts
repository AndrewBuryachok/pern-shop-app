import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Rent } from '../rents/rent.entity';

@Entity('wares')
export class Ware extends Thing {
  @Column({ name: 'rent_id' })
  rentId: number;

  @ManyToOne(() => Rent, { nullable: false })
  @JoinColumn({ name: 'rent_id' })
  rent: Rent;
}
