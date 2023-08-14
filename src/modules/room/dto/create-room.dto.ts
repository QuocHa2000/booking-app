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

export class CreateRoomDto {
  @ApiProperty({
    type: String,
    minLength: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  phone: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
