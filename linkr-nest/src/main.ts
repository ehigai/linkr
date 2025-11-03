import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import type { Express, Request, Response } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const server = app.getHttpAdapter().getInstance() as unknown as Express;

  app.useStaticAssets(join(__dirname, '..', 'public'));

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
