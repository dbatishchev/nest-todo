import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from './task.entity';
import { Expose } from 'class-transformer';
import {
  SERIALIZATION_GROUP_BASIC,
  SERIALIZATION_GROUP_EXTENDED,
} from '../../common/serializer.constants';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  id: number;

  @Column({ length: 64, nullable: false })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  title: string;

  @Column({ length: 256 })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  description: string;

  @CreateDateColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  updatedAt: Date;

  @OneToMany((type) => Task, (task) => task.group)
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  tasks: Task[];
}
