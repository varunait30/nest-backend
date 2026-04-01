import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  // ✅ Sorting
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc']) // ✅ validates only asc/desc
  order?: 'asc' | 'desc';

  @IsOptional()
  endDate?: string;
}
