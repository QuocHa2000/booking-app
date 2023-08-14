import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { hashPassword } from 'src/utils/hashing-password';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { AdminService } from './admin.service';
import { CreateManagerDto } from '../manager/dto/create-manager.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
