import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { CreateDiscountDto } from './dto/CreateDiscountDto';

@Injectable()
export class DiscountService {
  private ITEMS_PER_PAGE = 4;

  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  async createDiscount(discountDto: CreateDiscountDto) {
    const newDiscount = this.discountRepository.create({
      name: discountDto.name,
      posterUrl: discountDto.posterUrl,
      description: discountDto.description,
      ageRestriction: discountDto.ageRestriction,
      discountPercentage: discountDto.discountPercentage,
    });
    try {
      const savedDiscount = await this.discountRepository.save(newDiscount);
      return savedDiscount;
    } catch {
      await unlink(discountDto.posterUrl);
      throw new HttpException('Creation did not succeed', 400);
    }
  }

  async getDiscounts(page = 1) {
    const offset: number = +page === 1 ? 0 : page * this.ITEMS_PER_PAGE;
    const limitItems = offset ? this.ITEMS_PER_PAGE : this.ITEMS_PER_PAGE * 2;
    try {
      const [discounts, count] = await this.discountRepository.findAndCount({
        take: limitItems,
        skip: offset,
      });
      return { discounts, count };
    } catch {
      throw new HttpException('Error occured, try later', 400);
    }
  }
}
