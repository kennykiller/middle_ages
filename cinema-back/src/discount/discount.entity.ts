import { MaxLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class Discount {
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

  @Column({ type: 'int' })
  discountPercentage: number;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Order, (o) => o.discount)
  orders: Order[];
}
