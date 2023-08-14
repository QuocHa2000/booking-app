import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { MerchantController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [MerchantController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
