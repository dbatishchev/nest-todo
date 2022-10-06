import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import SignUpDTO from './dto/signup.input';
import CreateUserDTO from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signUpDTO: SignUpDTO) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signUpDTO.password, salt);

    const createUserDTO = new CreateUserDTO();
    createUserDTO.username = signUpDTO.username;
    createUserDTO.firstname = signUpDTO.firstname;
    createUserDTO.lastname = signUpDTO.lastname;
    createUserDTO.password = hash;
    createUserDTO.isActive = true;

    return await this.usersService.create(createUserDTO);
  }
}
