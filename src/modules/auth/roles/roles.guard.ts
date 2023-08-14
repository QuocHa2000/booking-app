import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { ClientService } from 'src/modules/client/client.service';
import { ClientStatus } from 'src/modules/client/client.entity';
import { ManagerService } from 'src/modules/manager/manager.service';
import { jwtConstants } from '../constants';
import { Role } from '../enum/role.enum';
import { ManagerStatus } from 'src/modules/manager/manager.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private clientService: ClientService,
    private adminService: AdminService,
    private managerService: ManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      const role = roles[0];

      if (!role) {
        console.log('Have no role');

        return false;
      }

      if (role === Role.All) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const bearerToken = request?.headers?.authorization;
      if (!bearerToken) {
        console.log('Have no bearer token');
        return false;
      }

      const token = bearerToken.slice(7);
      if (!token || !token.length) {
        console.log('Have no bearer token');
        return false;
      }

      const personData = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      let personToCheck;

      switch (role) {
        case Role.Admin:
          personToCheck = await this.adminService.findOne({
            where: {
              id: personData.id,
            },
          });
          request.admin = personToCheck;
          break;

        case Role.Client:
          personToCheck = await this.clientService.findOne({
            where: {
              id: personData.id,
              status: ClientStatus.ACTIVE,
            },
          });
          request.client = personToCheck;
          break;

        case Role.Manager:
          personToCheck = await this.managerService.findOne({
            where: {
              id: personData.id,
              status: ManagerStatus.ACTIVE,
            },
          });
          request.manager = personToCheck;
          break;

        default:
          break;
      }

      if (!personToCheck) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
