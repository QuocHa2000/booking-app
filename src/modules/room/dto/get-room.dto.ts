import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsAlphanumeric,
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsEmail,
  Length,
  Matches,
  IsPhoneNumber,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class GetAllRoomDto {
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
