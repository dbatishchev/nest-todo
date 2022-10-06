import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupDTO {
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @MaxLength(256)
  description: string;
}

export default CreateGroupDTO;
