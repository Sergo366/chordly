import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../entities/user.entity';
import { Currency } from '../../sales/entities/sale.entity';

export class UserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  surname: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  birthday: Date | null;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  profileImg: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsEnum(Currency)
  @IsOptional()
  currencyPreference: Currency;
}
