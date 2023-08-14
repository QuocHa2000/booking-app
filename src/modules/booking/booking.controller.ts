import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { BookRoomDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { GetAllDto } from 'src/common/dto/get-all.dto';

@ApiTags('Booking')
@Controller('booking')
export class MerchantController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/')
  @Roles(Role.Manager)
  async getAllBooking(@Query() getAllBookingDto: GetAllDto) {
    return await this.bookingService.getAllBooking(getAllBookingDto);
  }

  @Get('/:id')
  @Roles(Role.Manager)
  async getById(@Param('id') id: number) {
    return await this.bookingService.getBookingById(id);
  }

  // Manager
  @Post('/manager/updateBookingStatus')
  @Roles(Role.Manager)
  async updateBookingStatus(@Body() request: UpdateBookingStatusDto) {
    return await this.bookingService.updateBookingStatus(request);
  }

  // Client
  @Post('/bookRoom')
  @Roles(Role.Client)
  async bookRoom(@Request() request, @Body() bookRoomBody: BookRoomDto) {
    return await this.bookingService.bookRoom(request, bookRoomBody);
  }
}
