import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request, { SuperTest, Test as SuperTestRequest } from 'supertest';
import type { Server } from 'http';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const httpServer = app.getHttpServer() as unknown as Server;
    const agent: SuperTest<SuperTestRequest> = request(httpServer);
    return agent.get('/').expect(200).expect('Hello World!');
  });
});
