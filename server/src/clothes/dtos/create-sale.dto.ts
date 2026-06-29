import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Currency } from '../sale.entity';

export class CreateSaleDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsString()
  description: string;

  @IsBoolean()
  isNegotiable: boolean;
}
