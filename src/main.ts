import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverConfig = config.get('server');
  const loger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('fh');

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);

  loger.log(`Application listening on port ${port}`);
}
bootstrap();
