import { HttpException, Inject, Injectable } from '@nestjs/common';
import { BaseError } from 'src/utils/base-error';
import { hashPassword } from 'src/utils/hashing-password';
import { ClientService } from '../client/client.service';
import { CreateManagerDto } from '../manager/dto/create-manager.dto';
import { ManagerService } from '../manager/manager.service';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private readonly clientService: ClientService,
    private readonly managerService: ManagerService,
  ) {}

  findAll() {
    return this.adminRepository.find();
  }

  findById(id: number) {
    return this.adminRepository.findOneBy({ id });
  }

  findOne(condition) {
    return this.adminRepository.findOne(condition);
  }

  save(data) {
    return this.adminRepository.save(data);
  }

  async findWithPagination({ limit, page, ...query }): Promise<any[]> {
    const [result, total] = await this.adminRepository.findAndCount({
      where: { ...query },
      take: limit,
      skip: (page - 1) * limit,
    });

    return [result, total];
  }

  findOneAndUpdate(condition, data) {
    const oldRecord = this.adminRepository.findOne(condition);
    if (oldRecord) {
      throw new BaseError({ message: "Record doesn't existed" });
    }
    return this.adminRepository.save({ ...oldRecord, ...data });
  }

  async remove(id: number) {
    await this.adminRepository.delete(id);
  }
}
