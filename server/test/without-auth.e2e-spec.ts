import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { appConfig } from '../src/config/app.config';
import { Tokens } from '../src/features/auth/auth.interface';

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

describe('Without Auth', () => {
  let app: INestApplication;
  let user: Tokens;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appConfig(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /auth/login as User', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'User', password: 'User' })
        .expect(201)
        .then((res) => (user = res.body));
    });

    it('POST /auth/logout as User', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(201);
    });

    it('PATCH /auth/password', async () => {
      return request(app.getHttpServer()).patch('/auth/password').expect(401);
    });
  });

  describe('Users', () => {
    it('GET /users/my', async () => {
      return request(app.getHttpServer()).get('/users/my').expect(401);
    });

    it('GET /users/banned', async () => {
      return request(app.getHttpServer())
        .get('/users/banned')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /users/all', async () => {
      return request(app.getHttpServer())
        .get('/users/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /users/not-banned/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-banned/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /users/not-friends/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-friends/select')
        .expect(401);
    });
  });

  describe('Messages', () => {
    it('GET /messages/:userId', async () => {
      return request(app.getHttpServer())
        .get(`/messages/${user.id}`)
        .expect(401);
    });
  });

  describe('Friends', () => {
    it('GET /friends/my', async () => {
      return request(app.getHttpServer()).get('/friends/my').expect(401);
    });

    it('GET /friends/sent', async () => {
      return request(app.getHttpServer()).get('/friends/sent').expect(401);
    });

    it('GET /friends/received', async () => {
      return request(app.getHttpServer()).get('/friends/received').expect(401);
    });
  });

  describe('Articles', () => {
    it('GET /articles/my', async () => {
      return request(app.getHttpServer()).get('/articles/my').expect(401);
    });

    it('GET /articles/auth/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/auth/select')
        .expect(401);
    });

    it('GET /articles/all', async () => {
      return request(app.getHttpServer())
        .get('/articles/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Cards', () => {
    it('GET /cards/my', async () => {
      return request(app.getHttpServer()).get('/cards/my').expect(401);
    });

    it('GET /cards/all', async () => {
      return request(app.getHttpServer())
        .get('/cards/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /cards/my/select', async () => {
      return request(app.getHttpServer()).get('/cards/my/select').expect(401);
    });

    it('GET /cards/:userId/ext-select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/ext-select`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Exchanges', () => {
    it('GET /exchanges/my', async () => {
      return request(app.getHttpServer()).get('/exchanges/my').expect(401);
    });

    it('GET /exchanges/all', async () => {
      return request(app.getHttpServer())
        .get('/exchanges/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Payments', () => {
    it('GET /payments/my', async () => {
      return request(app.getHttpServer()).get('/payments/my').expect(401);
    });

    it('GET /payments/all', async () => {
      return request(app.getHttpServer())
        .get('/payments/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Invoices', () => {
    it('GET /invoices/my', async () => {
      return request(app.getHttpServer()).get('/invoices/my').expect(401);
    });

    it('GET /invoices/all', async () => {
      return request(app.getHttpServer())
        .get('/invoices/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Towns', () => {
    it('GET /towns/my', async () => {
      return request(app.getHttpServer()).get('/towns/my').expect(401);
    });

    it('GET /towns/all', async () => {
      return request(app.getHttpServer())
        .get('/towns/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /towns/my/select', async () => {
      return request(app.getHttpServer()).get('/towns/my/select').expect(401);
    });
  });

  describe('Invitations', () => {
    it('GET /invitations/sent', async () => {
      return request(app.getHttpServer()).get('/invitations/sent').expect(401);
    });

    it('GET /invitations/received', async () => {
      return request(app.getHttpServer())
        .get('/invitations/received')
        .expect(401);
    });
  });

  describe('Applications', () => {
    it('GET /applications/sent', async () => {
      return request(app.getHttpServer()).get('/applications/sent').expect(401);
    });

    it('GET /applications/received', async () => {
      return request(app.getHttpServer())
        .get('/applications/received')
        .expect(401);
    });
  });

  describe('Residents', () => {
    it('GET /residents/my', async () => {
      return request(app.getHttpServer()).get('/residents/my').expect(401);
    });
  });

  describe('Shops', () => {
    it('GET /shops/my', async () => {
      return request(app.getHttpServer()).get('/shops/my').expect(401);
    });

    it('GET /shops/all', async () => {
      return request(app.getHttpServer())
        .get('/shops/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /shops/my/select', async () => {
      return request(app.getHttpServer()).get('/shops/my/select').expect(401);
    });
  });

  describe('Stations', () => {
    it('GET /stations/my', async () => {
      return request(app.getHttpServer()).get('/stations/my').expect(401);
    });

    it('GET /stations/all', async () => {
      return request(app.getHttpServer())
        .get('/stations/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Goods', () => {
    it('GET /goods/my', async () => {
      return request(app.getHttpServer()).get('/goods/my').expect(401);
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Purchases', () => {
    it('GET /purchases/my', async () => {
      return request(app.getHttpServer()).get('/purchases/my').expect(401);
    });

    it('GET /purchases/all', async () => {
      return request(app.getHttpServer())
        .get('/purchases/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /purchases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/purchases/my/select')
        .expect(401);
    });

    it('GET /purchases/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/${user.id}/select`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Deliveries', () => {
    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer()).get('/deliveries/my').expect(401);
    });

    it('GET /deliveries/taken', async () => {
      return request(app.getHttpServer()).get('/deliveries/taken').expect(401);
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Orders', () => {
    it('GET /orders/my', async () => {
      return request(app.getHttpServer()).get('/orders/my').expect(401);
    });

    it('GET /orders/taken', async () => {
      return request(app.getHttpServer()).get('/orders/taken').expect(401);
    });

    it('GET /orders/all', async () => {
      return request(app.getHttpServer())
        .get('/orders/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });
});
