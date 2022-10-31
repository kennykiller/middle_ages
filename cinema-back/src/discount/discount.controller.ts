import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { DiscountService } from './discount.service';

@Controller('discounts')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Get()
  async getDiscounts(@Query('page') page: string) {
    return this.discountService.getDiscounts(+page);
  }

  @Get('/poster/:posterUrl')
  async servePoster(
    @Param('posterUrl') posterUrl: string,
    @Res() res: Response,
  ): Promise<any> {
    res.sendFile(join(process.cwd(), 'src/assets/posters', posterUrl));
  }
}
