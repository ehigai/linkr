import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import type { Express, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const server = app.getHttpAdapter().getInstance() as unknown as Express;
  server.get('/api/v1', (_req: Request, res: Response) =>
    res.json({ message: 'ACTIVE' }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
(async () => {
  await bootstrap();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
