import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsAlphanumeric,
  IsString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { GetAllDto } from 'src/common/dto/get-all.dto';
import { ClientStatus } from '../client.entity';

export class GetClientDto extends GetAllDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: string;
}
