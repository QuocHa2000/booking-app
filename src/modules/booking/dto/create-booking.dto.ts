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
  IsNumber,
} from 'class-validator';
import { Timestamp } from 'typeorm';

export class BookRoomDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  room: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  from: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  to: number;
}
