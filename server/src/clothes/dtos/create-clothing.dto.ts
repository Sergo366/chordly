import {
  IsString,
  IsIn,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CATEGORIES, SEASONS, Season } from '../../common/clothes';
import { CreateSaleDto } from './create-sale.dto';
import { Type } from 'class-transformer';

export class CreateClothingDto {
  @IsString()
  title: string;

  @IsString()
  userTitle: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  type: string;

  @IsString()
  @IsIn(CATEGORIES)
  category: string;

  @IsString({ each: true })
  @IsIn(SEASONS, { each: true })
  seasons: Season[];

  @IsString()
  @IsOptional()
  ticker?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsBoolean()
  @IsOptional()
  isForSale?: boolean;

  @IsOptional()
  @Type(() => CreateSaleDto)
  @ValidateNested()
  sale?: CreateSaleDto;
}
