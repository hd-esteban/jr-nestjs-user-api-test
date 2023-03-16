import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // Added whitelist flag to remove unknow properties by DTO.
      // https://docs.nestjs.com/techniques/validation#stripping-properties
      whitelist: true,
      // throw error when wrong properties are passed.
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sold.com | Jr. BE API Test')
    .setDescription('Testing your API abilities')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(9001);
}
bootstrap();
