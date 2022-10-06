import { Task } from '../src/tasks/entities/task.entity';
import { Group } from '../src/tasks/entities/group.entity';
import { User } from '../src/users/entities/user.entity';
import { DataSourceOptions } from 'typeorm';

const ormConfig: DataSourceOptions = {
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  entities: [Task, Group, User],
  synchronize: true,
  // logging: true,
};

export default ormConfig;
