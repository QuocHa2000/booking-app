import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsAlphanumeric,
  IsString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export enum SortOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetAllDto {
  @ApiProperty({
    type: Number,
  })
  @IsAlphanumeric()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    type: Number,
  })
  @IsAlphanumeric()
  @IsOptional()
  page?: number;
}

export class GetByIdDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class SearchDto extends GetAllDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  keyword?: string;
}
