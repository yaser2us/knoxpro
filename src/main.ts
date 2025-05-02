import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessControlInterceptor } from './common/interceptors/access.control.interceptor';
import { ZoiBootstrapService } from './zoi/zoi.bootstrap.service';
import { ZoiDynamicJsonApiModule } from './zoi/ZoiDynamicJsonApiModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './database';
import { JsonNormalizerPipe } from './common/pipe/json.normalizer.pipe';

// Option 1: Contribute a PR
// Patch json-api-nestjs to:

// Export ENTITY_PARAM_MAP

// Allow a registerEntity() method at runtime

// Recalculate routes and metadata

async function bootstrap() {

  // const zoiJsonApi = await ZoiDynamicJsonApiModule.forRootAsync();

  @Module({
    imports: [
      // TypeOrmModule.forRoot({
      //   ...config,
      //   synchronize: true,
      //   autoLoadEntities: true,
      //   logging: true,
      // }),
      AppModule,
      ZoiDynamicJsonApiModule.forRootAsync(),
    ],
  })
  class RootModule {}


  const app = await NestFactory.create(RootModule);
  const globalPrefix = 'api';
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://example.com'],
    // allowCredentials: true,
  });

  // Register global pipe to normalize JSON fields
  // app.useGlobalPipes(new JsonNormalizerPipe());

  const d =  [
    {
        "id": "grant_owner",
        "action": "grant",
        "to": [
            {
                "who": "user",
                "from": "document.owner"
            }
        ]
    },
    {
        "id": "grant_trainers",
        "action": "grant",
        "to": [
            {
                "who": "user",
                "from": "document.meta.trainerEmail"
            },
            {
                "who": "user",
                "from": "document.meta.auditorEmail"
            }
        ]
    },
    {
        "id": "send_email_submit",
        "action": "sendEmail",
        "to": "document.owner",
        "template": "form-submitted"
    },
    {
        "id": "wait_signature",
        "action": "waitFor",
        "condition": {
            "and": [
                {
                    "signedBy": "document.meta.trainerEmail"
                },
                {
                    "signedBy": "document.meta.auditorEmail"
                }
            ]
        }
    },
    {
        "id": "send_email_ready",
        "action": "sendEmail",
        "to": "document.owner",
        "template": "result-ready"
    }
]

console.log('[transform]', JSON.stringify(d))

  app.setGlobalPrefix(globalPrefix);
  // app.useGlobalInterceptors(new AccessControlInterceptor(new Reflector()));

  const zoiBootstrap = app.get(ZoiBootstrapService);

  await zoiBootstrap.bootstrap();

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
