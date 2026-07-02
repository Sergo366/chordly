import { Controller, Get, Query } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getAllSales(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('sort') sort: string,
  ) {
    return this.salesService.getAllSales(
      parseInt(page),
      parseInt(limit),
      search,
      sort,
    );
  }
}
