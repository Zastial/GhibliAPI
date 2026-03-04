import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEnum,
  IsInt,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export enum FilmStatus {
  UPCOMING = 'upcoming',
  RELEASED = 'released',
  ARCHIVED = 'archived',
}

export enum AgeRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG13',
}

export class CreateGhibliDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  originalTitle: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsDateString()
  releaseDate: Date;

  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty()
  @IsInt()
  duration: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  genres: string[];

  @ApiProperty({ enum: AgeRating })
  @IsEnum(AgeRating)
  ageRating: AgeRating;

  @ApiProperty({ enum: FilmStatus })
  @IsEnum(FilmStatus)
  status: FilmStatus;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty()
  @IsNumber()
  boxOffice: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  mainCharacters: string[];

  @ApiProperty()
  @IsString()
  synopsis: string;

  @ApiProperty({ type: [String], example: ['fr', 'en', 'jp'] })
  @IsArray()
  availableLanguages: string[];
}