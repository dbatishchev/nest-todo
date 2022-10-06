import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { TasksModule } from '../src/tasks/tasks.module';
import loadFixtures from '../test-utils/load-fixtures';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { User } from '../src/users/entities/user.entity';
import { TypeormTestingModule } from '../test-utils/typeorm-testing.module';
import { faker } from '@faker-js/faker';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';

describe('GroupsController', () => {
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

    const repository = moduleRef.get('GroupRepository'); // todo ugly
    const connection = repository.manager.connection;

    await app.init();
    await loadFixtures(connection); // todo pass ORM configuration
  });

  it(`/GET groups`, async () => {
    const response = await request(app.getHttpServer())
      .get('/groups')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/GET groups/:id`, async () => {
    const response = await request(app.getHttpServer())
      .get('/groups/1')
      .expect(200);

    expect(response.body).toBeTruthy();
    expect(response.body).toHaveProperty('id');
  });

  describe(`POST groups`, () => {
    let id = null;

    it(`should create group`, async () => {
      const response = await request(app.getHttpServer())
        .post('/groups')
        .send({
          title: 'test1',
          description: 'desc',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      id = response.body.id;
    });

    it(`should raise validation error on long title`, async () => {
      await request(app.getHttpServer())
        .post('/groups')
        .send({
          title: faker.lorem.word(65),
          description: 'desc',
        })
        .expect(400);
    });

    it(`should raise validation error on long description`, async () => {
      await request(app.getHttpServer())
        .post('/groups')
        .send({
          title: 'title',
          description: faker.lorem.word(257),
        })
        .expect(400);
    });

    it('should delete item', async () => {
      await request(app.getHttpServer()).delete(`/groups/${id}`).expect(200);
    });
  });

  describe(`PATCH groups/:id`, () => {
    const newGroup = {
      id: null,
      title: 'test1',
      description: 'desc',
    };

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/groups')
        .send(newGroup);
      newGroup.id = response.body.id;
    });

    it('should change item', async () => {
      await request(app.getHttpServer())
        .patch(`/groups/${newGroup.id}`)
        .send({
          title: 'new title',
        })
        .expect(200);
    });

    afterAll(async () => {
      await request(app.getHttpServer()).delete(`/groups/${newGroup.id}`);
    });
  });

  describe(`DELETE groups/:id`, () => {
    const newGroup = {
      id: null,
      title: 'test1',
      description: 'desc',
    };

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/groups')
        .send(newGroup);
      newGroup.id = response.body.id;
    });

    it('should delete item', async () => {
      await request(app.getHttpServer())
        .delete(`/groups/${newGroup.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
