import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clothing } from 'src/clothes/clothing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [],
})
export class SalesModule {}
