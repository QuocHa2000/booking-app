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
  IsNumber,
} from 'class-validator';
import { ClientGender } from '../client.entity';

export class UpdateMyInfoDto {
  @ApiProperty({
    type: String,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  clientName: string;

  @ApiProperty({
    type: String,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  avatar: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  dateOfBirth?: number;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsEnum(ClientGender)
  gender: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  weight?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  height?: number;
}
