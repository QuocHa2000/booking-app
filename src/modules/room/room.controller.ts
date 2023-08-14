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
import { RoomService } from './room.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetAllRoomDto } from './dto/get-room.dto';

@ApiTags('Room')
@Controller('room')
export class MerchantController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/')
  @Roles(Role.All)
  async getAllRoom(@Query() getAllRoomDto: GetAllRoomDto) {
    return await this.roomService.getAllRoom(getAllRoomDto);
  }

  @Roles(Role.All)
  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.roomService.getRoomById(id);
  }

  // Manager
  @Post('/manager/createRoom')
  @Roles(Role.Manager)
  async createRoom(@Request() request, @Body() createRoomBody: CreateRoomDto) {
    return await this.roomService.createRoom(request, createRoomBody);
  }

  @Post('/manager/updateRoom')
  @Roles(Role.Manager)
  async updateRoom(@Request() request, @Body() updateRoomBody: UpdateRoomDto) {
    return await this.roomService.updateRoom(request, updateRoomBody);
  }
}
