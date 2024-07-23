import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { Station } from './station.entity';

@Entity('stations_states')
export class StationState extends State {
  @Column({ name: 'station_id' })
  stationId: number;

  @ManyToOne(() => Station, { nullable: false })
  @JoinColumn({ name: 'station_id' })
  station: Station;
}
