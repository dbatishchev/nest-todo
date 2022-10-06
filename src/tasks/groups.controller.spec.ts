import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

export const repositoryMockFactory = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}));

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupsService: GroupsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    groupsService = moduleRef.get<GroupsService>(GroupsService);
    controller = moduleRef.get<GroupsController>(GroupsController);
  });

  describe(`getGroups`, () => {
    it('should return an array of groups', async () => {
      const result = [new Group()];
      jest
        .spyOn(groupsService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.getGroups()).toBe(result);
    });
  });
});
