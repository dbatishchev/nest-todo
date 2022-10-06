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
import CreateGroupDTO from './dto/create-group.input';
import { GroupsService } from './groups.service';
import { UpdateGroupDTO } from './dto/update-group.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  SERIALIZATION_GROUP_BASIC,
  SERIALIZATION_GROUP_EXTENDED,
} from '../common/serializer.constants';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_BASIC] })
  async getGroups() {
    return await this.groupsService.findAll();
  }

  @Get(':groupID')
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async getGroup(@Param('groupID') groupID: number) {
    return await this.groupsService.findOne(groupID);
  }

  @Post()
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async createGroup(@Body() createGroupDTO: CreateGroupDTO) {
    return await this.groupsService.createOne(createGroupDTO);
  }

  @Patch(':groupID')
  @SerializeOptions({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  async editGroup(
    @Param('groupID') groupID: number,
    @Body() updateGroupDTO: UpdateGroupDTO,
  ) {
    return await this.groupsService.editOne(groupID, updateGroupDTO);
  }

  @Delete(':groupID')
  async deleteGroup(@Param('groupID') groupID: number) {
    return await this.groupsService.remove(groupID);
  }
}
