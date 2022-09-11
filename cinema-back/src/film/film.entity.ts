import { MaxLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from '../session/session.entity';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  @MaxLength(120)
  name: string;

  @Column({ type: 'varchar', length: 5 })
  @MaxLength(5)
  ageRestriction: string;

  @Column({ type: 'text', nullable: true })
  posterUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'time' })
  filmDuration: string;

  @Column({ type: 'int' })
  basePrice: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => Session, (s) => s.film)
  sessions: Session[];
}
