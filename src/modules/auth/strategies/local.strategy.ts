import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone' });
  }

  async validate(phone: string, password: string) {
    try {
      const account = await this.authService.authentication(phone, password);
      if (!account) {
        throw new UnauthorizedException();
      }

      return account;
    } catch (error) {
      console.log('Getting error when validate localstrategy', error);
    }
  }
}
