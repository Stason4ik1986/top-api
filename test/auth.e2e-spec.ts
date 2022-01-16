import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';

import { AuthDto } from '../src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from '../src/auth/auth.constants';

const loginDto: AuthDto = {
  login: 'test@test.com',
  password: 'test'
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - Success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const token = body.access_token;
        expect(token).toBeDefined();
        done();
      })
  });

  it('/auth/login (POST) - Fail User Not Found', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'test1@test.com' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      })
  });

  it('/auth/login (POST) - Fail password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'test1' })
      .expect(401, {
        statusCode: 401,
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
      })
  });

  afterAll(async () => {
    disconnect();
  });
});
