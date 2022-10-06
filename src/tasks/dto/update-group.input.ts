import { PartialType } from '@nestjs/mapped-types';
import CreateGroupDTO from './create-group.input';

export class UpdateGroupDTO extends PartialType(CreateGroupDTO) {}
