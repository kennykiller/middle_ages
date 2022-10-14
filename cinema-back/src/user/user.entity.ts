import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Order } from 'src/order/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 120,
  })
  name: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;
  @Column({
    default: false,
  })
  isAdmin: boolean;
  @Column({
    length: 80,
    type: 'varchar',
  })
  phone: string;

  password: string;

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];
}
