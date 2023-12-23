import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { appConfig } from '../src/config/app.config';
import { Tokens } from '../src/features/auth/auth.interface';

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    connect: jest.fn(),
    publish: jest.fn(),
  })),
}));

describe('With Auth', () => {
  let app: INestApplication;
  let user: Tokens;
  let admin: Tokens;
  let banker: Tokens;
  let manager: Tokens;
  let judge: Tokens;
  let cardId: number;
  let invoicesId: number;
  let cityId: number;
  let shopId: number;
  let marketId: number;
  let storageId: number;
  let storeId: number;
  let rentId: number;
  let leaseId: number;
  let goodId: number;
  let wareId: number;
  let productId: number;
  let lotId: number;
  let tradeId: number;
  let saleId: number;
  let ordersId: number;
  let deliveriesId: number;
  let pollsId: number;
  let ratingId: number;
  let tasksId: number;
  let plaintsId: number;
  let articlesId: number;

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
      return request(app.getHttpServer())
        .patch('/auth/password')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ oldPassword: 'User', newPassword: 'User' })
        .expect('');
    });

    it('POST /auth/login as Admin', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Admin', password: 'Admin' })
        .expect(201)
        .then((res) => (admin = res.body));
    });

    it('POST /auth/logout as Admin', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect(201);
    });

    it('POST /auth/login as Banker', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Banker', password: 'Banker' })
        .expect(201)
        .then((res) => (banker = res.body));
    });

    it('POST /auth/logout as Banker', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect(201);
    });

    it('POST /auth/login as Manager', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Manager', password: 'Manager' })
        .expect(201)
        .then((res) => (manager = res.body));
    });

    it('POST /auth/logout as Manager', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect(201);
    });

    it('POST /auth/login as Judge', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Judge', password: 'Judge' })
        .expect(201)
        .then((res) => (judge = res.body));
    });

    it('POST /auth/logout as Judge', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${judge.access}`)
        .expect(201);
    });
  });

  describe('Cities', () => {
    it('POST /cities', async () => {
      return request(app.getHttpServer())
        .post('/cities')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My City', image: '', description: '', x: 500, y: 500 })
        .expect('');
    });

    it('GET /cities', async () => {
      return request(app.getHttpServer())
        .get('/cities')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cities/my', async () => {
      return request(app.getHttpServer())
        .get('/cities/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (cityId = res.body.result[0].id));
    });

    it('GET /cities/all', async () => {
      return request(app.getHttpServer())
        .get('/cities/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cities/all/select', async () => {
      return request(app.getHttpServer())
        .get('/cities/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cities/my/select', async () => {
      return request(app.getHttpServer())
        .get('/cities/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /cities/:cityId', async () => {
      return request(app.getHttpServer())
        .patch(`/cities/${cityId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My City', image: '', description: '', x: 500, y: 500 })
        .expect('');
    });

    it('POST /cities/:cityId/users', async () => {
      return request(app.getHttpServer())
        .post(`/cities/${cityId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });

    it('DELETE /cities/:cityId/users', async () => {
      return request(app.getHttpServer())
        .delete(`/cities/${cityId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });
  });

  describe('Users', () => {
    it('GET /users', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/my', async () => {
      return request(app.getHttpServer())
        .get('/users/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/all', async () => {
      return request(app.getHttpServer())
        .get('/users/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/all/select', async () => {
      return request(app.getHttpServer())
        .get('/users/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-citizens/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-citizens/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-friends/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-friends/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-followings/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-followings/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-rated/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-rated/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /users/:userId/password', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.id}/password`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ password: 'User' })
        .expect('');
    });

    it('POST /users/:userId/roles', async () => {
      return request(app.getHttpServer())
        .post(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ userId: user.id, role: 1 })
        .expect('');
    });

    it('DELETE /users/:userId/roles', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ userId: user.id, role: 1 })
        .expect('');
    });
  });

  describe('Cards', () => {
    it('POST /cards', async () => {
      return request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Card', color: 1 })
        .expect('');
    });

    it('GET /cards/my', async () => {
      return request(app.getHttpServer())
        .get('/cards/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (cardId = res.body.result[0].id));
    });

    it('GET /cards/all', async () => {
      return request(app.getHttpServer())
        .get('/cards/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cards/my/select', async () => {
      return request(app.getHttpServer())
        .get('/cards/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/ext-select`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /cards/:cardId', async () => {
      return request(app.getHttpServer())
        .patch(`/cards/${cardId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Card', color: 1 })
        .expect('');
    });

    it('POST /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .post(`/cards/${cardId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });

    it('DELETE /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .delete(`/cards/${cardId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });
  });

  describe('Exchanges', () => {
    it('POST /exchanges', async () => {
      return request(app.getHttpServer())
        .post('/exchanges')
        .set('Authorization', `Bearer ${banker.access}`)
        .send({ cardId, type: true, sum: 100 })
        .expect('');
    });

    it('GET /exchanges/my', async () => {
      return request(app.getHttpServer())
        .get('/exchanges/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /exchanges/all', async () => {
      return request(app.getHttpServer())
        .get('/exchanges/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });
  });

  describe('Payments', () => {
    it('POST /payments', async () => {
      return request(app.getHttpServer())
        .post('/payments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverCardId: cardId,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('GET /payments/my', async () => {
      return request(app.getHttpServer())
        .get('/payments/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /payments/all', async () => {
      return request(app.getHttpServer())
        .get('/payments/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });
  });

  describe('Invoices', () => {
    it('POST /invoices', async () => {
      return request(app.getHttpServer())
        .post('/invoices')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverUserId: user.id,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('POST /invoices', async () => {
      return request(app.getHttpServer())
        .post('/invoices')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          senderCardId: cardId,
          receiverUserId: user.id,
          sum: 10,
          description: '',
        })
        .expect('');
    });

    it('GET /invoices/my', async () => {
      return request(app.getHttpServer())
        .get('/invoices/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (invoicesId = res.body.result.map((i) => i.id)));
    });

    it('GET /invoices/received', async () => {
      return request(app.getHttpServer())
        .get('/invoices/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /invoices/all', async () => {
      return request(app.getHttpServer())
        .get('/invoices/all')
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /invoices/:invoiceId', async () => {
      return request(app.getHttpServer())
        .delete(`/invoices/${invoicesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invoices/:invoiceId', async () => {
      return request(app.getHttpServer())
        .post(`/invoices/${invoicesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });
  });

  describe('Shops', () => {
    it('POST /shops', async () => {
      return request(app.getHttpServer())
        .post('/shops')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Shop', image: '', description: '', x: 500, y: -500 })
        .expect('');
    });

    it('GET /shops', async () => {
      return request(app.getHttpServer())
        .get('/shops')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/my', async () => {
      return request(app.getHttpServer())
        .get('/shops/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopId = res.body.result[0].id));
    });

    it('GET /shops/all', async () => {
      return request(app.getHttpServer())
        .get('/shops/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/all/select', async () => {
      return request(app.getHttpServer())
        .get('/shops/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /shops/my/select', async () => {
      return request(app.getHttpServer())
        .get('/shops/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /shops/:shopId', async () => {
      return request(app.getHttpServer())
        .patch(`/shops/${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ name: 'My Shop', image: '', description: '', x: 500, y: -500 })
        .expect('');
    });
  });

  describe('Markets', () => {
    it('POST /markets', async () => {
      return request(app.getHttpServer())
        .post('/markets')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Market',
          image: '',
          description: '',
          x: -500,
          y: 500,
          price: 5,
        })
        .expect('');
    });

    it('GET /markets', async () => {
      return request(app.getHttpServer())
        .get('/markets')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets/my', async () => {
      return request(app.getHttpServer())
        .get('/markets/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketId = res.body.result[0].id));
    });

    it('GET /markets/all', async () => {
      return request(app.getHttpServer())
        .get('/markets/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets/main/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /markets/my/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /markets/all/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/all/select')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /markets/:marketId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets/${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Market',
          image: '',
          description: '',
          x: -500,
          y: 500,
          price: 10,
        })
        .expect('');
    });
  });

  describe('Storages', () => {
    it('POST /storages', async () => {
      return request(app.getHttpServer())
        .post('/storages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Storage',
          image: '',
          description: '',
          x: -500,
          y: -500,
          price: 5,
        })
        .expect('');
    });

    it('GET /storages', async () => {
      return request(app.getHttpServer())
        .get('/storages')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages/my', async () => {
      return request(app.getHttpServer())
        .get('/storages/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storageId = res.body.result[0].id));
    });

    it('GET /storages/all', async () => {
      return request(app.getHttpServer())
        .get('/storages/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages/main/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /storages/my/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /storages/all/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/all/select')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /storages/:storageId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages/${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Storage',
          image: '',
          description: '',
          x: -500,
          y: -500,
          price: 10,
        })
        .expect('');
    });
  });

  describe('Stores', () => {
    it('POST /stores', async () => {
      return request(app.getHttpServer())
        .post('/stores')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ marketId })
        .expect('');
    });

    it('GET /stores', async () => {
      return request(app.getHttpServer())
        .get('/stores')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stores/my', async () => {
      return request(app.getHttpServer())
        .get('/stores/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storeId = res.body.result[0].id));
    });

    it('GET /stores/all', async () => {
      return request(app.getHttpServer())
        .get('/stores/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stores/:marketId/select', async () => {
      return request(app.getHttpServer())
        .get(`/stores/${marketId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Cells', () => {
    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageId })
        .expect('');
    });

    it('GET /cells', async () => {
      return request(app.getHttpServer())
        .get('/cells')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/my', async () => {
      return request(app.getHttpServer())
        .get('/cells/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/all', async () => {
      return request(app.getHttpServer())
        .get('/cells/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/:storageId/select', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${storageId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /storages/free/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/free/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Rents', () => {
    it('POST /rents', async () => {
      return request(app.getHttpServer())
        .post('/rents')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storeId, cardId })
        .expect('');
    });

    it('GET /rents/my', async () => {
      return request(app.getHttpServer())
        .get('/rents/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (rentId = res.body.result[0].id));
    });

    it('GET /rents/placed', async () => {
      return request(app.getHttpServer())
        .get('/rents/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/all', async () => {
      return request(app.getHttpServer())
        .get('/rents/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/my/select', async () => {
      return request(app.getHttpServer())
        .get('/rents/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /rents/all/select', async () => {
      return request(app.getHttpServer())
        .get('/rents/all/select')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /wares', async () => {
      return request(app.getHttpServer())
        .post('/wares')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          rentId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('POST /rents/:rentId', async () => {
      return request(app.getHttpServer())
        .post(`/rents/${rentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Goods', () => {
    it('POST /goods', async () => {
      return request(app.getHttpServer())
        .post('/goods')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          shopId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /goods', async () => {
      return request(app.getHttpServer())
        .get('/goods')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /goods/my', async () => {
      return request(app.getHttpServer())
        .get('/goods/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (goodId = res.body.result[0].id));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${goodId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });
  });

  describe('Wares', () => {
    it('GET /wares', async () => {
      return request(app.getHttpServer())
        .get('/wares')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /wares/my', async () => {
      return request(app.getHttpServer())
        .get('/wares/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (wareId = res.body.result[0].id));
    });

    it('GET /wares/placed', async () => {
      return request(app.getHttpServer())
        .get('/wares/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /wares/all', async () => {
      return request(app.getHttpServer())
        .get('/wares/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /trades', async () => {
      return request(app.getHttpServer())
        .post('/trades')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ wareId, cardId, amount: 1 })
        .expect('');
    });

    it('PATCH /wares/:wareId', async () => {
      return request(app.getHttpServer())
        .patch(`/wares/${wareId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('POST /wares/:wareId', async () => {
      return request(app.getHttpServer())
        .post(`/wares/${wareId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Products', () => {
    it('POST /products', async () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /products', async () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /products/my', async () => {
      return request(app.getHttpServer())
        .get('/products/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (productId = res.body.result[0].id));
    });

    it('GET /products/placed', async () => {
      return request(app.getHttpServer())
        .get('/products/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /products/all', async () => {
      return request(app.getHttpServer())
        .get('/products/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /sales', async () => {
      return request(app.getHttpServer())
        .post('/sales')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ productId, cardId, amount: 1 })
        .expect('');
    });

    it('PATCH /products/:productId', async () => {
      return request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 20 })
        .expect('');
    });

    it('POST /products/:productId', async () => {
      return request(app.getHttpServer())
        .post(`/products/${productId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Lots', () => {
    it('POST /lots', async () => {
      return request(app.getHttpServer())
        .post('/lots')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /lots', async () => {
      return request(app.getHttpServer())
        .get('/lots')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /lots/my', async () => {
      return request(app.getHttpServer())
        .get('/lots/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (lotId = res.body.result[0].id));
    });

    it('GET /lots/placed', async () => {
      return request(app.getHttpServer())
        .get('/lots/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /lots/all', async () => {
      return request(app.getHttpServer())
        .get('/lots/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /bids', async () => {
      return request(app.getHttpServer())
        .post('/bids')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ lotId, cardId, price: 20 })
        .expect('');
    });

    it('POST /lots/:lotId', async () => {
      return request(app.getHttpServer())
        .post(`/lots/${lotId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Orders', () => {
    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('GET /orders', async () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/my', async () => {
      return request(app.getHttpServer())
        .get('/orders/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (ordersId = res.body.result.map((o) => o.id)));
    });

    it('POST /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /orders/taken', async () => {
      return request(app.getHttpServer())
        .get('/orders/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/placed', async () => {
      return request(app.getHttpServer())
        .get('/orders/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /orders/all', async () => {
      return request(app.getHttpServer())
        .get('/orders/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /orders/:orderId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /orders/:orderId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/orders/${ordersId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${ordersId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /orders/:orderId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/orders/${ordersId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .delete(`/orders/${ordersId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Deliveries', () => {
    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStorageId: storageId,
          toStorageId: storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStorageId: storageId,
          toStorageId: storageId,
          cardId,
          item: 1,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('GET /deliveries', async () => {
      return request(app.getHttpServer())
        .get('/deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (deliveriesId = res.body.result.map((d) => d.id)));
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${deliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /deliveries/:deliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${deliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${deliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /deliveries/:deliveryId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/deliveries/${deliveriesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/deliveries/${deliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /deliveries/:deliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${deliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/deliveries/${deliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Leases', () => {
    it('GET /leases/my', async () => {
      return request(app.getHttpServer())
        .get('/leases/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (leaseId = res.body.result[0].id));
    });

    it('GET /leases/placed', async () => {
      return request(app.getHttpServer())
        .get('/leases/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/all', async () => {
      return request(app.getHttpServer())
        .get('/leases/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /leases/:leaseId', async () => {
      return request(app.getHttpServer())
        .post(`/leases/${leaseId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Trades', () => {
    it('GET /trades/my', async () => {
      return request(app.getHttpServer())
        .get('/trades/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (tradeId = res.body.result[0].id));
    });

    it('GET /trades/selled', async () => {
      return request(app.getHttpServer())
        .get('/trades/selled')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /trades/placed', async () => {
      return request(app.getHttpServer())
        .get('/trades/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /trades/all', async () => {
      return request(app.getHttpServer())
        .get('/trades/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /trades/:tradeId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/trades/${tradeId}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });
  });

  describe('Sales', () => {
    it('GET /sales/my', async () => {
      return request(app.getHttpServer())
        .get('/sales/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (saleId = res.body.result[0].id));
    });

    it('GET /sales/selled', async () => {
      return request(app.getHttpServer())
        .get('/sales/selled')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /sales/placed', async () => {
      return request(app.getHttpServer())
        .get('/sales/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /sales/all', async () => {
      return request(app.getHttpServer())
        .get('/sales/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /sales/:saleId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/sales/${saleId}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });
  });

  describe('Bids', () => {
    it('GET /bids/my', async () => {
      return request(app.getHttpServer())
        .get('/bids/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /bids/selled', async () => {
      return request(app.getHttpServer())
        .get('/bids/selled')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /bids/placed', async () => {
      return request(app.getHttpServer())
        .get('/bids/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /bids/all', async () => {
      return request(app.getHttpServer())
        .get('/bids/all')
        .set('Authorization', `Bearer ${manager.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });
  });

  describe('Polls', () => {
    it('POST /polls', async () => {
      return request(app.getHttpServer())
        .post('/polls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ title: 'poll title', text: 'poll text' })
        .expect('');
    });

    it('POST /polls', async () => {
      return request(app.getHttpServer())
        .post('/polls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ title: 'poll title', text: 'poll text' })
        .expect('');
    });

    it('GET /polls', async () => {
      return request(app.getHttpServer())
        .get('/polls')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /polls/my', async () => {
      return request(app.getHttpServer())
        .get('/polls/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (pollsId = res.body.result.map((p) => p.id)));
    });

    it('POST /polls/:pollId/votes', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[0]}/votes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: true })
        .expect('');
    });

    it('POST /polls/:pollId/votes', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[1]}/votes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: false })
        .expect('');
    });

    it('GET /polls/voted', async () => {
      return request(app.getHttpServer())
        .get('/polls/voted')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /polls/all', async () => {
      return request(app.getHttpServer())
        .get('/polls/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /polls/:pollId', async () => {
      return request(app.getHttpServer())
        .delete(`/polls/${pollsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /polls/:pollId', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Friends', () => {
    it('POST /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .post(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /friends/my', async () => {
      return request(app.getHttpServer())
        .get('/friends/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /friends/received', async () => {
      return request(app.getHttpServer())
        .get('/friends/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .delete(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Followings', () => {
    it('POST /followings/:followingId', async () => {
      return request(app.getHttpServer())
        .post(`/followings/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /followings/my', async () => {
      return request(app.getHttpServer())
        .get('/followings/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /followings/received', async () => {
      return request(app.getHttpServer())
        .get('/followings/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', image: '' })
        .expect('');
    });

    it('GET /articles/followed', async () => {
      return request(app.getHttpServer())
        .get('/articles/followed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /followings/:followingId', async () => {
      return request(app.getHttpServer())
        .delete(`/followings/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Ratings', () => {
    it('POST /ratings', async () => {
      return request(app.getHttpServer())
        .post('/ratings')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: user.id, rate: 5 })
        .expect('');
    });

    it('GET /ratings/my', async () => {
      return request(app.getHttpServer())
        .get('/ratings/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (ratingId = res.body.result[0].id));
    });

    it('GET /ratings/received', async () => {
      return request(app.getHttpServer())
        .get('/ratings/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /ratings/all', async () => {
      return request(app.getHttpServer())
        .get('/ratings/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /ratings/:ratingId', async () => {
      return request(app.getHttpServer())
        .patch(`/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('DELETE /ratings/:ratingId', async () => {
      return request(app.getHttpServer())
        .delete(`/ratings/${ratingId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Tasks', () => {
    it('POST /tasks', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ title: 'task title', text: 'task text', priority: 1 })
        .expect('');
    });

    it('POST /tasks', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ title: 'task title', text: 'task text', priority: 1 })
        .expect('');
    });

    it('GET /tasks', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /tasks/my', async () => {
      return request(app.getHttpServer())
        .get('/tasks/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (tasksId = res.body.result.map((t) => t.id)));
    });

    it('POST /tasks/:taskId/take', async () => {
      return request(app.getHttpServer())
        .post(`/tasks/${tasksId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /tasks/taken', async () => {
      return request(app.getHttpServer())
        .get('/tasks/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /tasks/placed', async () => {
      return request(app.getHttpServer())
        .get('/tasks/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /tasks/all', async () => {
      return request(app.getHttpServer())
        .get('/tasks/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /tasks/:taskId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/tasks/${tasksId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /tasks/:taskId', async () => {
      return request(app.getHttpServer())
        .post(`/tasks/${tasksId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /tasks/:taskId/take', async () => {
      return request(app.getHttpServer())
        .post(`/tasks/${tasksId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /tasks/:taskId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${tasksId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /tasks/:taskId', async () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${tasksId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Plaints', () => {
    it('POST /plaints', async () => {
      return request(app.getHttpServer())
        .post('/plaints')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          title: 'plaint title',
          userId: user.id,
          text: 'sender text',
        })
        .expect('');
    });

    it('POST /plaints', async () => {
      return request(app.getHttpServer())
        .post('/plaints')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          title: 'plaint title',
          userId: user.id,
          text: 'sender text',
        })
        .expect('');
    });

    it('GET /plaints', async () => {
      return request(app.getHttpServer())
        .get('/plaints')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /plaints/my', async () => {
      return request(app.getHttpServer())
        .get('/plaints/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (plaintsId = res.body.result.map((p) => p.id)));
    });

    it('GET /plaints/received', async () => {
      return request(app.getHttpServer())
        .get('/plaints/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /plaints/all', async () => {
      return request(app.getHttpServer())
        .get('/plaints/all')
        .set('Authorization', `Bearer ${judge.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /plaints/:plaintId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/plaints/${plaintsId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'received text' })
        .expect('');
    });

    it('POST /plaints/:plaintId', async () => {
      return request(app.getHttpServer())
        .post(`/plaints/${plaintsId[0]}`)
        .set('Authorization', `Bearer ${judge.access}`)
        .send({ text: 'executor text' })
        .expect('');
    });

    it('DELETE /plaints/:plaintId', async () => {
      return request(app.getHttpServer())
        .delete(`/plaints/${plaintsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles', () => {
    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', image: '' })
        .expect('');
    });

    it('GET /articles', async () => {
      return request(app.getHttpServer())
        .get('/articles')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/my', async () => {
      return request(app.getHttpServer())
        .get('/articles/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (articlesId = res.body.result.map((p) => p.id)));
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[0]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[1]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /articles/liked', async () => {
      return request(app.getHttpServer())
        .get('/articles/liked')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/all', async () => {
      return request(app.getHttpServer())
        .get('/articles/all')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${articlesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', image: '' })
        .expect('');
    });

    it('DELETE /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .delete(`/articles/${articlesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });
});
