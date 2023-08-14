import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Injectable,
  UseGuards,
  Headers,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  UpdatePasswordDto,
  SignInDto,
  SignInWithFacebookDto,
  SignInWithGoogleDto,
} from './dto/sign-in.dto';
import {
  ActivateAccountDto,
  CheckAvailablePhoneDto,
  SendActivateCodeDto,
  SignUpDto,
} from './dto/sign-up.dto';
import { Role } from './enum/role.enum';
import { LocalAuthGuard } from './guard/local.guard';
import { Roles } from './roles/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles(Role.All)
  @Post('/signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Roles(Role.All)
  @Post('/sendActivateCode')
  sendActivateCode(@Body() sendActivateCode: SendActivateCodeDto) {
    return this.authService.sendActivateCode(sendActivateCode);
  }

  @Roles(Role.All)
  @Post('/activateAccount')
  activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
    return this.authService.activateAccount(activateAccountDto);
  }

  @Post('/signIn')
  @UseGuards(LocalAuthGuard)
  @Roles(Role.All)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // Admin

  @Roles(Role.All)
  @Post('/admin/signIn')
  adminSignIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // Manager
  @Roles(Role.All)
  @Post('/manager/signIn')
  managerSignIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
