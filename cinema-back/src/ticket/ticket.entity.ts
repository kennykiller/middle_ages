import { Max } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Seat } from '../seat/seat.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  @Max(9999.99)
  totalPrice: number;

  @OneToOne(() => Seat)
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => Order, (order) => order.tickets)
  order: Order;
}
