import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { TasksModule } from '../src/tasks/tasks.module';
import loadFixtures from '../test-utils/load-fixtures';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { User } from '../src/users/entities/user.entity';
import { TypeormTestingModule } from '../test-utils/typeorm-testing.module';
import { mainConfig } from '../src/main.config';
import { AppModule } from '../src/app.module';

// const fakeGuard: CanActivate = { canActivate: () => true };

describe('TasksController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [...TypeormTestingModule(), TasksModule, AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const user = new User();
          user.username = 'test';
          req.user = user;

          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();

    mainConfig(app);

    const repository = moduleRef.get('TaskRepository'); // todo ugly
    const connection = repository.manager.connection;

    await app.init();
    await loadFixtures(connection); // todo pass ORM configuration
  });

  it(`/GET tasks`, async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/GET tasks/:id`, async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks/1')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toBeTruthy();
    expect(response.body).toHaveProperty('id');
  });

  describe(`POST tasks`, () => {
    let id = null;

    it(`should create task`, async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'test1',
          description: 'desc',
          groupId: 1,
        })
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('id');
      id = response.body.id;
    });

    it(`should raise an error when group is not exist`, async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'test1',
          description: 'desc',
          groupId: 999,
        })
        .expect(400);
    });

    afterAll(async () => {
      await request(app.getHttpServer()).delete(`/tasks/${id}`).expect(200);
    });
  });

  describe(`PATCH tasks/:id`, () => {
    const newTask = {
      id: 1,
      title: 'test1',
      description: 'desc',
      isCompleted: false,
      groupId: 1,
    };

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(newTask);
      newTask.id = response.body.id;
    });

    it('should change item', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${newTask.id}`)
        .send({
          isCompleted: true,
        })
        .expect(200);
    });

    it('should raise an error when group is not exist', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${newTask.id}`)
        .send({
          groupId: 999,
        })
        .expect(400);
    });

    afterAll(async () => {
      await request(app.getHttpServer()).delete(`/tasks/${newTask.id}`);
    });
  });

  describe(`PATCH tasks/:id/done`, () => {
    const newTask = {
      id: null,
      title: 'test1',
      description: 'desc',
      isCompleted: false,
      groupId: 1,
    };

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(newTask);
      newTask.id = response.body.id;
    });

    it('should change item', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${newTask.id}/done`)
        .expect(200);
      expect(response.body.isCompleted).toBe(true);
    });

    afterAll(async () => {
      await request(app.getHttpServer()).delete(`/tasks/${newTask.id}`);
    });
  });

  describe(`DELETE tasks/:id`, () => {
    const newTask = {
      id: null,
      title: 'test1',
      description: 'desc',
      isCompleted: false,
      groupId: 1,
    };

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(newTask);
      newTask.id = response.body.id;
    });

    it('should delete item', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${newTask.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
