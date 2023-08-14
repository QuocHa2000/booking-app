import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GetAllDto } from 'src/common/dto/get-all.dto';
import { omitPersonField } from 'src/utils/helper';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import { BaseError } from 'src/utils/base-error';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetAllRoomDto } from './dto/get-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findAll() {
    return await this.roomRepository.find();
  }

  async findById(id: number) {
    return await this.roomRepository.findOneBy({ id });
  }

  async findOne(condition) {
    console.log('condition:', condition);
    return await this.roomRepository.findOne(condition);
  }

  async insertOne(data) {
    return await this.roomRepository.save(data);
  }

  async save(data) {
    return await this.roomRepository.save(data);
  }

  async findWithPagination({ limit, page, ...query }): Promise<any[]> {
    const [result, total] = await this.roomRepository.findAndCount({
      where: { ...query },
      take: limit,
      skip: (page - 1) * limit,
    });

    return [result, total];
  }

  findOneAndUpdate(condition, data) {
    const oldRecord = this.roomRepository.findOne(condition);
    if (oldRecord) {
      throw new BaseError({ message: "Record doesn't existed" });
    }
    return this.roomRepository.save({ ...oldRecord, ...data });
  }

  async remove(id: number) {
    await this.roomRepository.delete(id);
  }

  async getAllRoom(getAllRoomBody: GetAllRoomDto) {
    try {
      const { limit = 10, page = 1 } = getAllRoomBody;

      const [result, total] = await this.findWithPagination({ limit, page });

      const totalPage = Math.ceil(total / (+limit || 10));
      return {
        statusCode: 200,
        data: {
          data: result,
          total: total,
          totalPage,
        },
        message: 'Sign up successfully',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: error.statusCode,
          message: error.message,
          data: null,
        },
        400,
      );
    }
  }

  async getRoomById(id: number) {
    try {
      const result = await this.findById(id);
      return {
        statusCode: 200,
        data: result,
        message: 'Sign up successfully',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: error.statusCode,
          message: error.message,
          data: null,
        },
        400,
      );
    }
  }

  // Manager
  async createRoom(request, createRoomBody: CreateRoomDto) {
    try {
      console.log('createRoomBody:', createRoomBody);
      const { name, phone } = createRoomBody;
      const existedRoom = await this.findOne({ where: [{ phone }, { name }] });
      if (existedRoom) {
        throw new BaseError({ message: 'Room is existed' });
      }

      const room = await this.insertOne({ name, phone });
      return {
        statusCode: 200,
        data: room,
        message: 'Create room successfully',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: error.statusCode,
          message: error.message,
          data: null,
        },
        400,
      );
    }
  }

  async updateRoom(request, updateRoomBody: UpdateRoomDto) {
    try {
      const { id, name, phone } = updateRoomBody;
      const room = await this.findById(id);
      if (!room) {
        throw new BaseError({ message: 'Invalid room id' });
      }

      room.name = name ? name : room.name;
      room.phone = phone ? phone : room.phone;
      console.log('room:', room);

      const result = await this.save(room);
      return {
        statusCode: 200,
        data: result,
        message: 'Update room successfully',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          statusCode: error.statusCode,
          message: error.message,
          data: null,
        },
        400,
      );
    }
  }
}
