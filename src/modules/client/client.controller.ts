import { Controller, Get, Post, Body, Request, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { ClientService } from './client.service';
import { GetClientDto } from './dto/get-client.dto';
import { UpdateMyInfoDto } from './dto/update-client.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
}
