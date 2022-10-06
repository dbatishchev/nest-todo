import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @MaxLength(256)
  description: string;

  groupId: number;
}

export default CreateTaskDTO;
