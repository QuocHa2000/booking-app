import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CreateManagerDto } from './dto/create-manager.dto';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  // Admin
  @Get('/admin')
  @Roles(Role.Admin)
  async getAllManagerByAdmin(@Request() request) {
    return await this.managerService.getAllManagerByAdmin(request);
  }

  @Post('/createManager')
  @Roles(Role.Admin)
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    return await this.managerService.createManager(createManagerDto);
  }
}
