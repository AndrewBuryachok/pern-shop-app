import { AfterLoad, Entity, OneToMany } from 'typeorm';
import { PlaceWithPrice } from '../places/place.entity';
import { Drawer } from '../drawers/drawer.entity';
import { StationState } from './station-state.entity';

@Entity('stations')
export class Station extends PlaceWithPrice {
  @OneToMany(() => Drawer, (drawer) => drawer.station)
  drawers: Drawer[];

  @OneToMany(() => StationState, (state) => state.station)
  states: StationState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
