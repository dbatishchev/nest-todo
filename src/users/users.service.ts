import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/create-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(createUserDTO: CreateUserDTO) {
    const user = new User();
    user.username = createUserDTO.username;
    user.firstName = createUserDTO.firstname;
    user.lastName = createUserDTO.lastname;
    user.password = createUserDTO.password;
    user.isActive = createUserDTO.isActive;

    return await this.usersRepository.save(user);
  }
}
