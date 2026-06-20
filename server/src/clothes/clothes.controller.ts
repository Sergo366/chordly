import 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClothesService } from './clothes.service';
import { CreateClothingDto } from './dtos/create-clothing.dto';
import { UpdateClothingDto } from './dtos/update-clothing.dto';
import { GetPresignedUrlDto } from './dtos/get-presigned-url.dto';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { S3Service } from './s3.service';

@Controller('clothes')
export class ClothesController {
  constructor(
    private readonly clothesService: ClothesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('/presigned-url')
  async getPresignedUrl(
    @Body() body: GetPresignedUrlDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.s3Service.getPresignedUploadUrl(
      body.filename,
      body.contentType,
      userId,
    );
  }

  @Post('/get-clothes-from-image')
  @UseInterceptors(FileInterceptor('image'))
  async getClothes(@UploadedFile() file: Express.Multer.File) {
    return this.clothesService.getClothesFromImage(file);
  }

  @Post('/save-clothes')
  async saveClothes(
    @Body() body: CreateClothingDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.clothesService.saveClothes(body, userId);
  }

  @Patch(':id')
  update(
    @GetCurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) clothesId: string,
    @Body() updateClothingDto: UpdateClothingDto,
  ) {
    return this.clothesService.update(userId, clothesId, updateClothingDto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.clothesService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @GetCurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.clothesService.findOne(userId, id);
  }

  @Delete(':id')
  remove(
    @GetCurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.clothesService.remove(userId, id);
  }
}
