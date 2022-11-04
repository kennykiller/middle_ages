import { User } from 'src/user/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from '../discount/discount.entity';
import { PaymentStatus } from '../status/payment_status.entity';
import { Seat } from '../seat/seat.entity';
import { Ticket } from '../ticket/ticket.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

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
