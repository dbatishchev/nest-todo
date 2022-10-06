import { Test } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';

export const repositoryMockFactory = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}));

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Group),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    controller = moduleRef.get<TasksController>(TasksController);
  });

  describe(`getTasks`, () => {
    it('should return an array of tasks', async () => {
      const result = [new Task()];
      jest
        .spyOn(tasksService, 'findAll')
        .mockImplementation(async () => result);

      expect(await controller.getTasks()).toBe(result);
    });
  });
});
