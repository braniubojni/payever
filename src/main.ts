import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = +(process.env.PORT || 3003);

  app.setGlobalPrefix('api');

  app.startAllMicroservices();
  await app.listen(PORT, () => console.log(`Server at ${PORT}`));
}

bootstrap();
