import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GetAllDto } from 'src/common/dto/get-all.dto';
import { omitPersonField } from 'src/utils/helper';
import { Booking, BookingStatus } from './booking.entity';
import { LessThanOrEqual, Repository, MoreThanOrEqual } from 'typeorm';
import { BaseError } from 'src/utils/base-error';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { BookRoomDto } from './dto/create-booking.dto';
import moment from 'moment';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findAll() {
    return await this.bookingRepository.find();
  }

  async findById(id: number) {
    return await this.bookingRepository.findOne({ where: { id } });
  }

  async findOne(condition) {
    return await this.bookingRepository.findOne(condition);
  }

  async insertOne(data) {
    return await this.bookingRepository.save(data);
  }

  async save(data) {
    return await this.bookingRepository.save(data);
  }

  async findWithPagination({ limit, page, ...query }): Promise<any[]> {
    const [result, total] = await this.bookingRepository.findAndCount({
      where: { ...query },
      take: limit,
      skip: (page - 1) * limit,
    });

    return [result, total];
  }

  findOneAndUpdate(condition, data) {
    const oldRecord = this.bookingRepository.findOne(condition);
    if (oldRecord) {
      throw new BaseError({ message: "Record doesn't existed" });
    }
    return this.bookingRepository.save({ ...oldRecord, ...data });
  }

  async remove(id: number) {
    await this.bookingRepository.delete(id);
  }

  async getAllBooking(getAllBooking: GetAllDto) {
    try {
      const { limit = 10, page = 1 } = getAllBooking;

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

  async getBookingById(id: number) {
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
  async updateBookingStatus(updateBookingStatusBody: UpdateBookingStatusDto) {
    try {
      const { id, status } = updateBookingStatusBody;
      console.log('id:', id);
      const booking = await this.findById(id);
      console.log('booking:', booking);
      if (!booking) {
        throw new BaseError({ message: 'Invalid booking id' });
      }

      booking.status = status;

      const result = await this.save(booking);
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

  //   Client
  async bookRoom(req: any, bookRoomBody: BookRoomDto) {
    try {
      const client = req.client;
      const { room, from, to } = bookRoomBody;
      const fromFormatted = moment(from).startOf('date').valueOf() / 1000;
      const toFormatted = moment(to).startOf('date').valueOf() / 1000;

      const existedBookingRoom = await this.findOne({
        where: {
          room: room,
          from: LessThanOrEqual(toFormatted),
          to: MoreThanOrEqual(fromFormatted),
          status: BookingStatus.APPROVED,
        },
      });

      if (existedBookingRoom) {
        throw new BaseError({
          message: 'This room is unavailable in this period time',
        });
      }

      const booking = await this.insertOne({
        client: client.id,
        room,
        from: fromFormatted,
        to: toFormatted,
      });

      return {
        statusCode: 200,
        data: booking,
        message: 'Book room successfully',
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
