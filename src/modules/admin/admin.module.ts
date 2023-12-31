import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ClientModule } from '../client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { ManagerModule } from '../manager/manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), ClientModule, ManagerModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
