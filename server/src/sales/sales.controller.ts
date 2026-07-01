import { Controller, Get, Query } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getAllSales(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.salesService.getAllSales(parseInt(page), parseInt(limit));
  }
}
