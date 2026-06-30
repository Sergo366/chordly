import 'multer';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clothing } from './clothing.entity';
import { UpdateClothingDto } from './dtos/update-clothing.dto';
import { CreateClothingDto } from './dtos/create-clothing.dto';
import { AiService } from '../ai/ai.service';
import { GoogleSearchService } from '../google-search/google-search.service';
import { SerperImageResult } from 'src/google-search/interfaces/search-response.interface';
import { Sale } from '../sales/entities/sale.entity';

@Injectable()
export class ClothesService {
  constructor(
    @InjectRepository(Clothing)
    private readonly clothesRepository: Repository<Clothing>,
    private readonly aiService: AiService,
    private readonly searchService: GoogleSearchService,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async getClothesFromImage(
    file?: Express.Multer.File,
  ): Promise<{ ticker: string; searchResults: SerperImageResult[] }> {
    let ticker = '';

    if (file) {
      ticker = await this.aiService.getClothingTicker(
        file.buffer,
        file.mimetype,
      );
    }

    if (!ticker) {
      // Throw error if ticker is empty to trigger frontend error handling
      throw new BadRequestException(
        'Error. Could not identify a clothing ticker from the image. Please try again later',
      );
    }

    const searchResults = await this.searchService.findImages(ticker);

    if (!searchResults || searchResults.length === 0) {
      throw new NotFoundException(
        'No similar images found for the identified clothing.',
      );
    }

    return {
      ticker,
      searchResults,
    };
  }

  async saveClothes(dto: CreateClothingDto, userId: string): Promise<Clothing> {
    const clothing = this.clothesRepository.create({
      title: dto.title,
      type: dto.type,
      category: dto.category,
      seasons: dto.seasons,
      userTitle: dto.userTitle,
      imageUrl: dto.imageUrl,
      ticker: dto.ticker,
      userId,
    });

    return this.clothesRepository.save(clothing);
  }

  async findAll(userId: string): Promise<Clothing[]> {
    return this.clothesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Clothing> {
    const clothing = await this.clothesRepository.findOne({
      where: { id, userId },
    });

    if (!clothing) {
      throw new NotFoundException(`Clothing with ID ${id} not found`);
    }

    return clothing;
  }

  async update(userId: string, clothesId: string, dto: UpdateClothingDto) {
    const clothing = await this.findOne(userId, clothesId);

    if (!dto.isForSale && clothing.sale) {
      await this.saleRepository.delete(clothing.sale.id);
      clothing.sale = null;
    }

    const updated = this.clothesRepository.merge(clothing, dto);
    await this.clothesRepository.save(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.clothesRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Clothing with ID ${id} not found`);
    }
  }
}
