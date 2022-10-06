import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import CreateTaskDTO from './dto/create-task.input';
import { Group } from './entities/group.entity';
import { UpdateTaskDTO } from './dto/update-task.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  findOne(id: number): Promise<Task> {
    return this.tasksRepository.findOneBy({ id });
  }

  async createOne(taskDTO: CreateTaskDTO): Promise<Task> {
    const task = new Task();
    task.title = taskDTO.title;
    task.description = taskDTO.description;

    const group = await this.groupsRepository.findOneBy({
      id: taskDTO.groupId,
    });

    if (!group) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }

    task.group = group;

    return await this.tasksRepository.save(task);
  }

  async editOne(id: number, updateTaskDTO: UpdateTaskDTO): Promise<Task> {
    if (updateTaskDTO.groupId) {
      const group = await this.groupsRepository.findOneBy({
        id: updateTaskDTO.groupId,
      });

      if (!group) {
        throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
      }
    }

    await this.tasksRepository.update(id, updateTaskDTO);

    const updatedTodo = await this.tasksRepository.findOneBy({ id });

    if (updatedTodo) {
      return updatedTodo;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async done(id: number): Promise<Task> {
    await this.tasksRepository.update(id, { isCompleted: true });
    const updatedTodo = await this.tasksRepository.findOneBy({ id });

    if (updatedTodo) {
      return updatedTodo;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.tasksRepository.delete(id);

    if (!deleteResult.affected) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
