import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: () => 0 })
  startAmount: number;

  @Column({ nullable: true })
  endAmount: number;

  @OneToMany(() => User, (u) => u.userStatus)
  users: User[];
}
