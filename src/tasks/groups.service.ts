import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import CreateGroupDTO from './dto/create-group.input';
import { UpdateGroupDTO } from './dto/update-group.input';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: {
        tasks: true, // todo
      },
    });
  }

  findOne(id: number): Promise<Group> {
    return this.groupRepository.findOneBy({ id });
  }

  async createOne(groupDTO: CreateGroupDTO): Promise<Group> {
    const group = new Group();
    group.title = groupDTO.title;
    group.description = groupDTO.description;

    return await this.groupRepository.save(group);
  }

  async editOne(id: number, updateTaskDTO: UpdateGroupDTO): Promise<Group> {
    await this.groupRepository.update(id, updateTaskDTO);
    const updatedTodo = await this.groupRepository.findOneBy({ id });

    if (updatedTodo) {
      return updatedTodo;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.groupRepository.delete(id);

    if (!deleteResult.affected) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
