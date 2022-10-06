import { PartialType } from '@nestjs/mapped-types';
import CreateTaskDTO from './create-task.input';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}
