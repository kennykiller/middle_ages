import { User } from 'src/user/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Discount } from '../discount/discount.entity';
import { PaymentStatus } from '../status/payment_status.entity';
import { Seat } from '../seat/seat.entity';
import { Ticket } from '../ticket/ticket.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => PaymentStatus, (status) => status.orders)
  status: PaymentStatus;

  @ManyToOne(() => Discount, (d) => d.orders)
  discount: Discount;

  @OneToMany(() => Seat, (seat) => seat.order)
  public seats!: Seat[];

  @OneToMany(() => Ticket, (t) => t.order)
  public tickets: Ticket[];
}
