import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessControlInterceptor } from './common/interceptors/access.control.interceptor';
import { ZoiBootstrapService } from './zoi/zoi.bootstrap.service';
// import { ZoiDynamicJsonApiModule } from './zoi/ZoiDynamicJsonApiModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';

import { config } from './database';
import { JsonNormalizerPipe } from './common/pipe/json.normalizer.pipe';
import { ZoiDynamicJsonApiModule } from './zoi/ZoiDynamicJsonApiModule.v2';
import * as qs from 'qs';

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
    class RootModule { }


    const app = await NestFactory.create(RootModule, {
        // logger: WinstonModule.createLogger(winstonConfig),
        logger: ['log', 'debug', 'warn', 'error', 'verbose'], // all levels
    });

    //   app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const globalPrefix = 'api';
    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'https://example.com', 'https://playbox-git-features-newlookhi-yasser-batoies-projects.vercel.app'],
        // allowCredentials: true,
    });

    // Register global pipe to normalize JSON fields
    // app.useGlobalPipes(new JsonNormalizerPipe());

    const d = [
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

    const config = new DocumentBuilder()
        .setOpenAPIVersion('3.1.1')
        .setTitle('Knox pro')
        .setDescription('joy of engineering ;) thanks Allah.')
        .setVersion('1.0')
        .build();
    // app.set('query parser', 'extended');

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(
        'swagger',
        app,
        document,
        {}
    );

    writeFileSync('./openapi-spec.yaml', yaml.dump(document));

    const zoiBootstrap = app.get(ZoiBootstrapService);

    await zoiBootstrap.bootstrap();

    // Configure Express to use qs for query parsing
    app.getHttpAdapter().getInstance().set('query parser', (str: string) => {
        return qs.parse(str, {
            allowDots: false,
            arrayLimit: 100,
            depth: 10,
            parseArrays: true
        });
    });

    // In your main.ts or as middleware
    app.use('/api/school', (req, res, next) => {
        console.log('=== DEBUG QUERY PARAMS ===');
        console.log('URL:', req.url);
        console.log('Raw query:', req.query);
        console.log('Query string:', req.url.split('?')[1]);
        console.log('========================');
        next();
    });

    await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
