import {
  Post,
  Body,
  HttpCode,
  Controller,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly _authService: AuthService) {

  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this._authService.findUser(dto.login);

    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    return this._authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this._authService.validateUser(login, password);

    return this._authService.login(email);
  }

}
