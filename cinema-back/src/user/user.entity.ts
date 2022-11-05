import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Order } from 'src/order/order.entity';
import { UserStatus } from '../user_status/user_status.entity';

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

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];

  @ManyToOne(() => UserStatus, (us) => us.users)
  userStatus: UserStatus;
}
