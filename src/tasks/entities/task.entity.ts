import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Group } from './group.entity';
import { Expose } from 'class-transformer';
import {
  SERIALIZATION_GROUP_BASIC,
  SERIALIZATION_GROUP_EXTENDED,
} from '../../common/serializer.constants';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  id: number;

  @Column({ length: 64, nullable: false })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  title: string;

  @Column({ length: 256 })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  description: string;

  @Column({ default: false })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  isCompleted: boolean;

  @ManyToOne((type) => Group, (group) => group.tasks)
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  group: Group;

  @CreateDateColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  updatedAt: Date;
}
