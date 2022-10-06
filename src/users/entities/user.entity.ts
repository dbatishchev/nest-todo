import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import {
  SERIALIZATION_GROUP_BASIC,
  SERIALIZATION_GROUP_EXTENDED,
} from '../../common/serializer.constants';

@Entity()
export class User {
  @PrimaryColumn()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  username: string;

  @Column()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  firstName: string;

  @Column()
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED, SERIALIZATION_GROUP_BASIC] })
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  @Expose({ groups: [SERIALIZATION_GROUP_EXTENDED] })
  isActive: boolean;
}
