import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilmStatus } from './create-ghibli.dto';

export class QueryGhibliDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(FilmStatus)
  status?: FilmStatus;

  @IsOptional()
  @IsString()
  @IsIn(['en', 'fr', 'jp', 'es', 'de'])
  language?: string;

  @IsOptional()
  @IsString()
  @IsIn(['releaseDate', 'rating'])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}