import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountService } from '../discount/discount.service';
import { SeatService } from '../seat/seat.service';
import { SessionService } from '../session/session.service';
import { PaymentStatusService } from '../status/payment_status.service';
import { User } from '../user/user.entity';
import { UsersService } from '../user/user.service';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    private seatService: SeatService,
    private userService: UsersService,
    private statusService: PaymentStatusService,
    private discountService: DiscountService,
    private sessionService: SessionService,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    try {
      if (await this.seatService.checkSeatsAvailability(dto.seats)) {
        throw new BadRequestException('Заказ на эти места уже существует');
      }
      const user = await this.userService.findOne(dto.userId);
      const ordersOfUser = await this.findUsersOrders(user);
      const newOrderStatus = await this.statusService.getStatusByName('booked');
      const discount = ordersOfUser
        ? dto.discountId
        : await this.discountService.getFirstBookingDiscount();
      const newOrder = this.orderRepo.create({
        user,
        status: newOrderStatus,
        discount,
      });
      const createdOrder = await this.orderRepo.save(newOrder);
      await this.seatService.updateSeatStatus(dto.seats, createdOrder);
      await this.sessionService.updateAvailableSeats(
        dto.sessionId,
        dto.seats.length,
        'decrease',
      );
      return createdOrder;
    } catch (e) {
      throw new HttpException(e.message || 'Order creation failed', 400);
    }
  }

  async findUsersOrders(user: User) {
    return await this.orderRepo.findOne({
      where: {
        user,
      },
    });
  }

  async getLatestUnpaidOrder(userId: number) {
    try {
      const user = await this.userService.findOne(userId);
      const unpaidStatus = await this.statusService.getStatusByName('booked');
      const unpaidOrder = await this.orderRepo.findOne({
        where: { user, status: unpaidStatus },
        relations: ['seats', 'seats.session', 'seats.session.film'],
      });
      if (unpaidOrder) return unpaidOrder;
      throw new NotFoundException({ message: 'No unpaid orders found!' });
    } catch (e) {
      throw new HttpException(e.message || 'No unpaid orders found', e.status);
    }
  }

  async removeOrder(orderId: number) {
    try {
      const order = await this.orderRepo.findOne({ where: { id: orderId } });
      const seatsTaken = await this.seatService.getTakenSeats(order);
      await this.sessionService.updateAvailableSeats(
        seatsTaken[0]?.session.id,
        seatsTaken.length,
        'increase',
      );
      return await this.orderRepo.delete({ id: orderId });
    } catch (e) {
      throw new HttpException(e.message || 'Order removal failed', 400);
    }
  }
}
