import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Res,
  Body,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import SignUpDTO from './dto/signup.input';
import { SERIALIZATION_GROUP_EXTENDED } from '../common/serializer.constants';
import { UsersService } from '../users/users.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async Signup(@Res() response, @Body() user: SignUpDTO) {
    await this.authService.signup(user);

    return response.status(HttpStatus.CREATED).json({ ok: 'ok' });
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @SerializeOptions({
    groups: [SERIALIZATION_GROUP_EXTENDED],
  })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.username);
  }
}
