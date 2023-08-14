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

export class UpdateRoomDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @Length(1)
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    minLength: 10,
    required: true,
  })
  @IsNumberString()
  @Length(10)
  phone: string;
}
