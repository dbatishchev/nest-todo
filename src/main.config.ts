import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CustomClassSerializerInterceptor } from './common/custom-class-serializer.interceptor';
import { Reflector } from '@nestjs/core';

export function mainConfig(app: INestApplication) {
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new CustomClassSerializerInterceptor(app.get(Reflector)),
  );
}
