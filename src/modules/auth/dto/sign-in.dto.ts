import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsAlphanumeric,
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsPhoneNumber,
  Length,
  IsNumberString,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(5)
  phone?: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password?: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  oldPassword: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  newPassword: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  reenterPassword: string;
}

export class SignInWithGoogleDto {
  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  accessToken: string;

  @ApiProperty({
    type: String,
    minLength: 5,
  })
  @IsString()
  deviceToken?: number;
}

export class SignInWithFacebookDto {
  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  accessToken: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  deviceToken?: number;
}
