import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from '../film/film.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;
}
