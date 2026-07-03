import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../entities/user.entity';
import { Currency } from '../../sales/entities/sale.entity';

export class UserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  birthday: Date | null;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  profileImg: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsEnum(Currency)
  currencyPreference: Currency;
}
