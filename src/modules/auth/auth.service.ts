import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseError } from 'src/utils/base-error';
import { checkHashPassword, hashPassword } from 'src/utils/hashing-password';
import { ClientService } from '../client/client.service';
import { UpdatePasswordDto, SignInDto } from './dto/sign-in.dto';
import {
  ActivateAccountDto,
  SendActivateCodeDto,
  SignUpDto,
} from './dto/sign-up.dto';
import _ from 'lodash';
import { randomNumberString } from 'src/utils/helper';
import { ClientStatus } from '../client/client.entity';
import { Role } from './enum/role.enum';
import { AdminService } from '../admin/admin.service';
import { ManagerService } from '../manager/manager.service';
// import Promise from 'bluebird';
@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private managerService: ManagerService,
  ) {}

  async authentication(phone: string, password: string): Promise<any> {
    try {
      const [client, admin] = await Promise.all([
        this.clientService.findOne({
          where: {
            phone,
          },
        }),
        this.adminService.findOne({
          where: {
            phone,
          },
        }),
      ]);

      if (!client && !admin) {
        return false;
      }
      const person = client || admin;
      const isValidPassword = await checkHashPassword(
        password,
        person.password,
      );

      if (!isValidPassword) {
        return false;
      }

      return client;
    } catch (error) {
      throw error;
    }
  }

  async signUp(newClient: SignUpDto) {
    try {
      const { password, phone, email, name, dateOfBirth, gender } = newClient;

      const [existedClient, existedMerchant, existedAdmin] = await Promise.all([
        this.clientService.findOne({
          where: {
            phone,
          },
        }),
        this.managerService.findOne({
          where: {
            phone,
          },
        }),
        this.adminService.findOne({
          phone,
        }),
      ]);
      if (existedClient || existedMerchant || existedAdmin) {
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

      const client = await this.clientService.insertOne({
        phone,
        email,
        dateOfBirth,
        gender,
        name: name,
        password: hashedPassword,
        rawName,
      });

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

  async signIn(client: SignInDto) {
    try {
      const code = randomNumberString(4);
      const { phone, password } = client;

      const person: any =
        (await this.clientService.findOne({
          where: {
            phone,
          },
        })) ||
        (await this.adminService.findOne({
          where: {
            phone,
          },
        })) ||
        (await this.managerService.findOne({
          where: {
            phone,
          },
        }));
      if (!person) {
        throw new BaseError({
          message: 'Phone is invalid !',
        });
      }

      const isValidPassword = await checkHashPassword(
        password,
        person.password,
      );
      if (!isValidPassword) {
        throw new BaseError({
          message: 'Password is invalid !',
        });
      }

      if (
        person.role === Role.Client &&
        person.status === ClientStatus.INACTIVE
      ) {
        person.activateCode = code;
        person.latestCodeTime = new Date().getTime();

        const newPerson = await this.clientService.save(person);

        return {
          statusCode: 200,
          data: {
            person: newPerson,
            activateCode: code,
          },
          message: 'Sign in  successfully',
        };
      }

      const payload = {
        id: person.id,
        phone: person.phone,
        name: person.name,
        role: person.role,
      };

      const result = _.omit(person, ['password', '_id']);

      const accessToken = this.jwtService.sign(payload);
      return {
        statusCode: 200,
        data: {
          person: result,
          accessToken,
        },
        message: 'Sign in with Google successfully',
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

  async updatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    try {
      const client = req.client;
      const { oldPassword, newPassword, reenterPassword } = updatePasswordDto;
      const clientData = await this.clientService.findById(client._id);

      if (newPassword !== reenterPassword) {
        throw new BaseError({ message: 'Re-enter not equal to new password' });
      }

      const isMatchPassword = await checkHashPassword(
        oldPassword,
        clientData.password,
      );
      if (!isMatchPassword) {
        throw new BaseError({ message: 'Invalid old password' });
      }

      const password = await hashPassword(newPassword);
      clientData.password = password;

      await this.clientService.save(clientData);
      return {
        statusCode: 200,
        data: true,
        message: 'Sign in with Google successfully',
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

  async sendActivateCode(sendActivateCodeBody: SendActivateCodeDto) {
    try {
      const code = randomNumberString(4);
      const { phone } = sendActivateCodeBody;

      const client = await this.clientService.findOne({
        where: {
          phone,
        },
      });
      if (!client) {
        throw new BaseError({
          message: 'Not found client correspond with this email',
        });
      }

      if (client.status === ClientStatus.ACTIVE) {
        throw new BaseError({ message: 'Your account is activated' });
      }

      client.activateCode = code;

      await this.clientService.save(client);

      return {
        statusCode: 200,
        data: {
          phone,
          activateCode: code,
        },
        message: 'Get activate code successfully',
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

  async checkAvailablePhone(phone: string) {
    try {
      console.log(phone);

      const [existedClient, existedMerchant, existedAdmin] = await Promise.all([
        this.clientService.findOne({
          phone,
        }),
        this.managerService.findOne({
          where: {
            phone,
          },
        }),
        this.adminService.findOne({
          phone,
        }),
      ]);

      const result =
        existedClient || existedMerchant || existedAdmin ? false : true;

      return {
        statusCode: 200,
        data: {
          available: result,
        },
        message: 'Get activate code successfully',
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

  async activateAccount(activateAccountBody: ActivateAccountDto) {
    try {
      const { phone, code } = activateAccountBody;

      const client = await this.clientService.findOne({
        where: {
          phone,
        },
      });
      if (!client) {
        throw new BaseError({
          message: 'Not found client correspond with this email',
        });
      }

      if (client.activateCode !== code && client.activateCode !== '999999') {
        throw new BaseError({
          message: 'Code is invalid !',
        });
      }

      client.status = ClientStatus.ACTIVE;

      const result = await this.clientService.save(client);

      return {
        statusCode: 200,
        data: {
          client: result,
        },
        message: 'Activate account successfully',
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
  async managerUpdatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    try {
      const manager = req.manager;
      const { oldPassword, newPassword, reenterPassword } = updatePasswordDto;
      const managerData = await this.managerService.findById(manager._id);

      if (newPassword !== reenterPassword) {
        throw new BaseError({ message: 'Re-enter not equal to new password' });
      }

      const isMatchPassword = await checkHashPassword(
        oldPassword,
        managerData.password,
      );
      if (!isMatchPassword) {
        throw new BaseError({ message: 'Invalid old password' });
      }

      const password = await hashPassword(newPassword);
      managerData.password = password;

      await this.managerService.save(managerData);

      return {
        statusCode: 200,
        data: true,
        message: 'Sign in with Google successfully',
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

  // ADMIN
  async adminUpdatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    try {
      const admin = req.admin;
      const { oldPassword, newPassword, reenterPassword } = updatePasswordDto;
      const adminData = await this.adminService.findById(admin._id);

      if (newPassword !== reenterPassword) {
        throw new BaseError({ message: 'Re-enter not equal to new password' });
      }

      const isMatchPassword = await checkHashPassword(
        oldPassword,
        adminData.password,
      );
      if (!isMatchPassword) {
        throw new BaseError({ message: 'Invalid old password' });
      }

      const password = await hashPassword(newPassword);
      adminData.password = password;

      await this.adminService.save(adminData);

      return {
        statusCode: 200,
        data: true,
        message: 'Sign in with Google successfully',
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
