import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GetAllDto } from 'src/common/dto/get-all.dto';
import { omitPersonField } from 'src/utils/helper';
import { Manager } from './manager.entity';
import { Repository } from 'typeorm';
import { BaseError } from 'src/utils/base-error';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from '../client/client.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { hashPassword } from 'src/utils/hashing-password';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,

    private readonly clientService: ClientService,
  ) {}

  findAll() {
    return this.managerRepository.find();
  }

  findById(id: number) {
    return this.managerRepository.findOneBy({ id });
  }

  async findOne(condition) {
    return await this.managerRepository.findOne(condition);
  }

  insertOne(data) {
    return this.managerRepository.save(data);
  }

  save(data) {
    return this.managerRepository.save(data);
  }

  async findWithPagination({ limit, page, ...query }): Promise<any[]> {
    const [result, total] = await this.managerRepository.findAndCount({
      where: { ...query },
      take: limit,
      skip: (page - 1) * limit,
    });

    return [result, total];
  }

  findOneAndUpdate(condition, data) {
    const oldRecord = this.managerRepository.findOne(condition);
    if (oldRecord) {
      throw new BaseError({ message: "Record doesn't existed" });
    }
    return this.managerRepository.save({ ...oldRecord, ...data });
  }

  async remove(id: number) {
    await this.managerRepository.delete(id);
  }

  // Admin
  async getAllManagerByAdmin(getAllManager: GetAllDto) {
    try {
      const { limit, page } = getAllManager;

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

  async createManager(createManagerBody: CreateManagerDto) {
    try {
      const { password, phone, email, name } = createManagerBody;

      const [existedClient, existedAdmin, existedManager] = await Promise.all([
        this.clientService.findOne({ where: [{ phone }, { email }] }),
        this.findOne({
          where: {
            phone,
          },
        }),
        this.findOne({ where: [{ phone }, { email }] }),
      ]);
      if (existedClient || existedAdmin || existedManager) {
        throw new BaseError({ message: 'Your phone or email has been used !' });
      }

      const hashedPassword = await hashPassword(password);
      const rawName = name
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

      const manager = await this.insertOne({
        phone,
        email,
        name,
        password: hashedPassword,
        rawName,
      });

      return {
        statusCode: 200,
        data: manager,
        message: 'Create manager successfully',
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

  async getMyInfo(req: any) {
    try {
      const { id } = req.manager;

      const rawManager = await this.findById(id);

      const manager = omitPersonField(rawManager);
      return {
        statusCode: 200,
        data: manager,
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
}
