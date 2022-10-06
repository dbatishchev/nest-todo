import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import CreateTaskDTO from './dto/create-task.input';
import { UpdateTaskDTO } from './dto/update-task.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  SERIALIZATION_GROUP_BASIC,
  SERIALIZATION_GROUP_EXTENDED,
} from '../common/serializer.constants';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_BASIC] })
  async getTasks() {
    return await this.tasksService.findAll();
  }

  @Get(':taskID')
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async getTask(@Param('taskID') taskID: number) {
    return await this.tasksService.findOne(taskID);
  }

  @Post()
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async createTask(@Body() createTaskDTO: CreateTaskDTO) {
    return await this.tasksService.createOne(createTaskDTO);
  }

  @Patch(':taskID')
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async editTask(
    @Param('taskID') taskID: number,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ) {
    return await this.tasksService.editOne(taskID, updateTaskDTO);
  }

  @Patch(':taskID/done')
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async completeTask(@Param('taskID') taskID: number) {
    return await this.tasksService.done(taskID);
  }

  @Delete(':taskID')
  async deleteTask(@Param('taskID') taskID: number) {
    return await this.tasksService.remove(taskID);
  }
}
