import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: number;

  @Column({ type: 'timestamptz', name: 'reserved_at', nullable: true })
  reservedAt?: Date;
}
