import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
}
