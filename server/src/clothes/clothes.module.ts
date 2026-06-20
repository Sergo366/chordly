import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothesController } from './clothes.controller';
import { ClothesService } from './clothes.service';
import { Clothing } from './clothing.entity';
import { AiModule } from '../ai/ai.module';
import { GoogleSearchModule } from '../google-search/google-search.module';
import { S3Service } from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clothing]), AiModule, GoogleSearchModule],
  controllers: [ClothesController],
  providers: [ClothesService, S3Service],
  exports: [ClothesService],
})
export class ClothesModule {}
