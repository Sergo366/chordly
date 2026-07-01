import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clothing } from 'src/clothes/clothing.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Clothing)
    private readonly clothesRepository: Repository<Clothing>,
  ) {}

  async getAllSales(page: number = 1, limit: number = 10) {
    try {
      const [data, total] = await this.clothesRepository.findAndCount({
        where: {
          isForSale: true,
        },
        relations: ['sale'],
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not get data for sales',
        error,
      );
    }
  }
}
