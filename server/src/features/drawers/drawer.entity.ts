import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Container } from '../containers/container.entity';
import { Station } from '../stations/station.entity';

@Entity('drawers')
export class Drawer extends Container {
  @Column({ name: 'station_id' })
  stationId: number;

  @ManyToOne(() => Station, { nullable: false })
  @JoinColumn({ name: 'station_id' })
  station: Station;
}
