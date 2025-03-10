import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessControlInterceptor } from './common/interceptors/access.control.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://example.com'],
    // allowCredentials: true,
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new AccessControlInterceptor(new Reflector()));

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
