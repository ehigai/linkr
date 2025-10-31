import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import type { Express, Request, Response } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import Handlebars from 'handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const server = app.getHttpAdapter().getInstance() as unknown as Express;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  server.get('/api/v1', (_req: Request, res: Response) =>
    res.json({ message: 'ACTIVE' }),
  );

  // handle bars preparation scripts
  Handlebars.registerHelper('loud', (text: string) => {
    return text.toLocaleUpperCase();
  });

  await app.listen(process.env.PORT ?? 4000);
}
(async () => {
  await bootstrap();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
