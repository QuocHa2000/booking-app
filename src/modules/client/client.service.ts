import { HttpException, Inject, Injectable } from '@nestjs/common';
import { omitPersonField } from 'src/utils/helper';
import { UpdateMyInfoDto } from './dto/update-client.dto';
import { BaseError } from 'src/utils/base-error';
import { GetClientDto } from './dto/get-client.dto';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll() {
    return this.clientRepository.find();
  }

  findById(id: number) {
    return this.clientRepository.findOneBy({ id });
  }

  async findOne(condition) {
    return await this.clientRepository.findOne(condition);
  }

  save(data) {
    return this.clientRepository.save(data);
  }

  insertOne(data) {
    return this.clientRepository.save(data);
  }

  async findWithPagination({ limit, page, ...query }): Promise<any[]> {
    const [result, total] = await this.clientRepository.findAndCount({
      where: { ...query },
      take: limit,
      skip: (page - 1) * limit,
    });

    return [result, total];
  }

  findOneAndUpdate(condition, data) {
    const oldRecord = this.clientRepository.findOne(condition);
    if (oldRecord) {
      throw new BaseError({ message: "Record doesn't existed" });
    }
    return this.clientRepository.save({ ...oldRecord, ...data });
  }

  async remove(id: number) {
    await this.clientRepository.delete(id);
  }

  async getMyInfo(req: any): Promise<any> {
    try {
      const { id } = req.client;

      const rawClient = await this.findById(id);

      const client = omitPersonField(rawClient);
      return {
        statusCode: 200,
        data: client,
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

  async updateMyInfo(
    req: any,
    updateMyInfoBody: UpdateMyInfoDto,
  ): Promise<any> {
    try {
      const { id } = req.client;
      const { clientName, weight, height } = updateMyInfoBody;

      const rawClient = await this.findById(id);

      if (!rawClient) {
        throw new BaseError({ message: 'Not found your account  ' });
      }

      let rawName = '';

      let updateInfo: any = { ...updateMyInfoBody };
      if (clientName) {
        rawName = clientName
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        updateInfo = { ...updateInfo, rawName };
      }

      const result = await this.findOneAndUpdate({ _id: id }, updateInfo);

      const client = omitPersonField(result);
      return {
        statusCode: 200,
        data: client,
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

  // Admin
  async getAllClientByAdmin(getAllDto: GetClientDto) {
    try {
      const { limit, page, ...query } = getAllDto;

      const [result, total] = await this.findWithPagination({
        limit,
        page,
        query,
      });

      const totalPage = Math.ceil(total / (+limit || 10));
      return {
        statusCode: 200,
        data: {
          data: result,
          total: total,
          totalPage,
        },
        message: 'Get All Client Successfully',
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
