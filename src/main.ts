import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nest Todo')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: 'http://localhost:5173', // Разрешить запросы с этого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Если нужны куки
  });
  await app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
  );
}
bootstrap();
