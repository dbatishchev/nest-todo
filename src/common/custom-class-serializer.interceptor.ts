import {
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { SERIALIZATION_GROUP_EXTENDED } from './serializer.constants';

const isTrue = (value: string): boolean => {
  return [true, 'enabled', 'true'].indexOf(value) > -1;
};

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  protected getContextOptions(context: ExecutionContext) {
    const res = this.reflector.getAllAndOverride(CLASS_SERIALIZER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (isTrue(req.query.extends)) {
      res.groups = [...res.groups, SERIALIZATION_GROUP_EXTENDED];
    }

    return res;
  }
}
