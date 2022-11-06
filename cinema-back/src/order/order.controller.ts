import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GenericValidation } from '../pipes/GenericValidation.pipe';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrderService) {}

  @Post('new-order')
  async createOrder(@Body(new GenericValidation()) dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get(':userId')
  async getUnpaidOrder(@Param('userId', ParseIntPipe) id: number) {
    return this.orderService.getLatestUnpaidOrder(id);
  }

  @Delete(':orderId')
  async removeOrder(@Param('orderId', ParseIntPipe) id: number) {
    return this.orderService.removeOrder(id);
  }
}
