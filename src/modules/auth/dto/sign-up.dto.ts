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
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { ClientGender } from 'src/modules/client/client.entity';

export class SignUpDto {
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
    minLength: 5,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ClientGender)
  gender: string;

  @ApiProperty({
    type: String,
    minLength: 8,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'Password too weak',
  //   })
  password: string;

  @ApiProperty({
    type: String,
    minLength: 8,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirm: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  dateOfBirth: number;
}

export class SendActivateCodeDto {
  @ApiProperty({
    type: String,
    minLength: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  phone: string;
}

export class ActivateAccountDto {
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
    minLength: 4,
    maxLength: 4,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(4)
  code: string;
}

export class CheckAvailablePhoneDto {
  @ApiProperty({
    type: String,
    minLength: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  phone: string;
}
