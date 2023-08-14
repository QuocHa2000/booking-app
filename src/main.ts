import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as admin from 'firebase-admin';
import firebaseKey from '../src/config/firebase-key.json';
import getMongoUrl from './utils/get-mongo-url';
import { InitService } from './modules/init/init.service';

async function bootstrap() {
  console.log('Start Running App ');
  console.log(getMongoUrl());

  const app = await NestFactory.create(AppModule, {
    cors: true,
    abortOnError: true,
  });

  // Apply prefix for all routes
  app.setGlobalPrefix('/api');
  // Versioning
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  const initService = app.get(InitService);
  initService.runInit();

  admin.initializeApp({
    credential: admin.credential.cert(firebaseKey as any),
    storageBucket: 'pmg-testnet.appspot.com',
    // databaseURL:
    //   'https://pmg-testnet-default-rtdb.asia-southeast1.firebasedatabase.app',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Fitness API Documentation')
    .setDescription('The fitness API description')
    .setVersion('1.0')
    .addTag('Fitness')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);

  console.log(
    `Open http://localhost:${process.env.API_PORT}/document to see the documentation`,
  );

  await app.listen(process.env.API_PORT);
}

bootstrap();
