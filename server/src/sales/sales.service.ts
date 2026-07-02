import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clothing } from 'src/clothes/clothing.entity';

const SORT_TYPES = {
  NONE: 'none',
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
};

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Clothing)
    private readonly clothesRepository: Repository<Clothing>,
  ) {}

  async getAllSales(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: string = SORT_TYPES.NONE,
  ) {
    try {
      const queryBuilder = this.clothesRepository
        .createQueryBuilder('clothing')
        .innerJoin('clothing.sale', 'sale')
        .addSelect(['sale'])
        .where('clothing.isForSale = :isForSale', { isForSale: true });

      if (search) {
        queryBuilder.andWhere(
          '(clothing.title ILIKE :search OR clothing.userTitle ILIKE :search OR clothing.type ILIKE :search OR clothing.category ILIKE :search OR sale.title ILIKE :search OR sale.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      switch (sort) {
        case SORT_TYPES.NONE:
          break;
        case SORT_TYPES.NEWEST:
          queryBuilder.orderBy('clothing.createdAt', 'DESC');
          break;
        case SORT_TYPES.OLDEST:
          queryBuilder.orderBy('clothing.createdAt', 'ASC');
          break;
        case SORT_TYPES.PRICE_ASC:
          queryBuilder.orderBy('sale.price', 'ASC');
          break;
        case SORT_TYPES.PRICE_DESC:
          queryBuilder.orderBy('sale.price', 'DESC');
          break;
      }

      const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

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
