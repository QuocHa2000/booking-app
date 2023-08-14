import { Injectable } from '@nestjs/common';
import { hashPassword } from 'src/utils/hashing-password';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class InitService {
  async initGym() {
    try {
    } catch (error) {
      console.log('Getting error when executing initGym ', error);
    }
  }
  async runInit() {
    try {
      await Promise.all([this.initGym()]);
    } catch (error) {
      console.log('Getting error when run runInit module');
      console.log(error);
      throw error;
    }
  }
}
