import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async getAllSales() {
    try {
      const sales = await this.saleRepository.find();
      return sales;
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
}
