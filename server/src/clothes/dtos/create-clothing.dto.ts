import { IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { CATEGORIES, SEASONS, Season } from '../../common/clothes';

export class CreateClothingDto {
  @IsString()
  title: string;

  @IsString()
  userTitle: string;

  @IsString()
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
  ticker: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsBoolean()
  @IsOptional()
  isForSale?: boolean;
}
