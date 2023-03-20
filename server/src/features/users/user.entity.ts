import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { City } from '../cities/city.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [] })
  roles: Role[];

  @Column({ name: 'city_id', nullable: true })
  cityId?: number;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ default: false })
  status: boolean;
}
