import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from '../film/film.entity';
import { Seat } from '../seat/seat.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  filmStart: Date;

  @Column({ default: 100, type: 'int' })
  seatsAvailable: number;

  @Column({ type: 'int', default: 500 })
  price: number;

  @ManyToOne(() => Film, (f) => f.sessions, { onDelete: 'CASCADE' })
  public film: Film;

  @OneToMany(() => Seat, (seat) => seat.session)
  public seats!: Seat[];
}
