import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  // Validation pipe global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Finance API')
    .setDescription('Its a Finance API with NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  const port = process.env.APP_PORT;
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger running on http://localhost:${port}/docs`);
  });
}
bootstrap();
