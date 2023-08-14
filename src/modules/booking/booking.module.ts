import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { MerchantController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [MerchantController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
