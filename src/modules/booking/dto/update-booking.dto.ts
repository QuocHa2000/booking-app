import { ApiProperty, PartialType } from '@nestjs/swagger';
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
  isEnum,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingStatusDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum([BookingStatus.APPROVED, BookingStatus.CANCELED])
  status: string;
}
