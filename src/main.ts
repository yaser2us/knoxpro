import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessControlInterceptor } from './common/interceptors/AccessControlInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new AccessControlInterceptor(new Reflector()));

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
