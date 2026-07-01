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

  async getAllSales() {
    try {
      return await this.clothesRepository.find({
        where: {
          isForSale: true,
        },
        relations: ['sale'],
      });
    } catch (error) {
      new InternalServerErrorException(error, 'Could not get data for sales');
    }
  }
}
