import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { appConfig } from '../src/config/app.config';
import { Tokens } from '../src/features/auth/auth.interface';
import { Role } from '../src/features/users/role.enum';
import { Item } from '../src/features/things/item.enum';

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

describe('With Auth', () => {
  let app: INestApplication;
  let user: Tokens;
  let admin: Tokens;
  let moder: Tokens;
  let banker: Tokens;
  let messageId: number;
  let articlesId: number[];
  let commentId: number;
  let cardId: number;
  let exchangesId: number;
  let paymentsId: number;
  let invoicesId: number;
  let townId: number;
  let shopId: number;
  let stationId: number;
  let goodsId: number[];
  let purchasesId: number[];
  let deliveriesId: number[];
  let ordersId: number[];

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

    it('POST /auth/login as Moder', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Moder', password: 'Moder' })
        .expect(201)
        .then((res) => (moder = res.body));
    });

    it('POST /auth/logout as Moder', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${moder.access}`)
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
  });

  describe('Users', () => {
    it('POST /towns', async () => {
      return request(app.getHttpServer())
        .post('/towns')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Town',
          description: '',
          x: 500,
          y: 500,
        })
        .expect('');
    });

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

    it('POST /users/:userId/banned', async () => {
      return request(app.getHttpServer())
        .post(`/users/${user.id}/banned`)
        .set('Authorization', `Bearer ${moder.access}`)
        .expect('');
    });

    it('GET /users/banned', async () => {
      return request(app.getHttpServer())
        .get('/users/banned')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /users/:userId/banned', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${user.id}/banned`)
        .set('Authorization', `Bearer ${moder.access}`)
        .expect('');
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

    it('GET /users/not-banned/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-banned/select')
        .set('Authorization', `Bearer ${moder.access}`)
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

    it('PATCH /users/:userId/profile', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.id}/profile`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          nick: user.nick,
          avatar: '',
          background: 1,
          discord: '',
          twitch: '',
          youtube: '',
        })
        .expect('');
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
        .send({ role: Role.ADMIN })
        .expect('');
    });

    it('DELETE /users/:userId/roles', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({ role: Role.ADMIN })
        .expect('');
    });
  });

  describe('Messages', () => {
    it('POST /messages', async () => {
      return request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          userId: user.id,
          messageId: 0,
          text: 'message text',
        })
        .expect('');
    });

    it('GET /messages/:userId', async () => {
      return request(app.getHttpServer())
        .get(`/messages/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (messageId = res.body[0].id));
    });

    it('PATCH /messages/:messageId', async () => {
      return request(app.getHttpServer())
        .patch(`/messages/${messageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'message text' })
        .expect('');
    });

    it('DELETE /messages/:messageId', async () => {
      return request(app.getHttpServer())
        .delete(`/messages/${messageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Friends', () => {
    it('POST /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .post(`/friends/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /friends/sent', async () => {
      return request(app.getHttpServer())
        .get('/friends/sent')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /friends/received', async () => {
      return request(app.getHttpServer())
        .get('/friends/received')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .post(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('GET /friends/my', async () => {
      return request(app.getHttpServer())
        .get('/friends/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .delete(`/friends/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles', () => {
    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
        .expect('');
    });

    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
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

    it('POST /articles/:articleId/views', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[0]}/views`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[0]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: true })
        .expect('');
    });

    it('POST /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/articles/${articlesId[1]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: false })
        .expect('');
    });

    it('POST /comments', async () => {
      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ articleId: articlesId[0], commentId: 0, text: 'comment text' })
        .expect('');
    });

    it('GET /articles/auth/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/auth/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) =>
          expect(
            res.body.view.length + res.body.up.length + res.body.down.length,
          ).toBeGreaterThan(0),
        );
    });

    it('GET /articles/:articleId/views', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${articlesId[0]}/views`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /articles/:articleId/likes', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${articlesId[0]}/likes`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /comments/:articleId', async () => {
      return request(app.getHttpServer())
        .get(`/comments/${articlesId[0]}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (commentId = res.body[0].id));
    });

    it('GET /articles/all', async () => {
      return request(app.getHttpServer())
        .get('/articles/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${articlesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'article text', images: [] })
        .expect('');
    });

    it('DELETE /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .delete(`/articles/${articlesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles Comments', () => {
    it('PATCH /comments/:commentId', async () => {
      return request(app.getHttpServer())
        .patch(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'comment text' })
        .expect('');
    });

    it('DELETE /comments/:commentId', async () => {
      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${user.access}`)
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
        .set('Authorization', `Bearer ${moder.access}`)
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

    it('GET /cards/:userId/ext-select', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${user.id}/ext-select`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cards/:cardId/users', async () => {
      return request(app.getHttpServer())
        .get(`/cards/${cardId}/users`)
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
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (exchangesId = res.body.result.map((e) => e.id)));
    });

    it('DELETE /exchanges/:exchangeId', async () => {
      return request(app.getHttpServer())
        .delete(`/exchanges/${exchangesId[0]}`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect('');
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
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (paymentsId = res.body.result.map((p) => p.id)));
    });

    it('DELETE /payments/:paymentId', async () => {
      return request(app.getHttpServer())
        .delete(`/payments/${paymentsId[0]}`)
        .set('Authorization', `Bearer ${moder.access}`)
        .expect('');
    });
  });

  describe('Invoices', () => {
    it('POST /invoices', async () => {
      return request(app.getHttpServer())
        .post('/invoices')
        .set('Authorization', `Bearer ${moder.access}`)
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
        .set('Authorization', `Bearer ${moder.access}`)
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

    it('GET /invoices/all', async () => {
      return request(app.getHttpServer())
        .get('/invoices/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /invoices/:invoiceId', async () => {
      return request(app.getHttpServer())
        .delete(`/invoices/${invoicesId[0]}`)
        .set('Authorization', `Bearer ${moder.access}`)
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

  describe('Towns', () => {
    it('GET /towns', async () => {
      return request(app.getHttpServer())
        .get('/towns')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /towns/my', async () => {
      return request(app.getHttpServer())
        .get('/towns/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (townId = res.body.result[0].id));
    });

    it('GET /towns/all', async () => {
      return request(app.getHttpServer())
        .get('/towns/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /towns/all/select', async () => {
      return request(app.getHttpServer())
        .get('/towns/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /towns/my/select', async () => {
      return request(app.getHttpServer())
        .get('/towns/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /towns/:townId/users', async () => {
      return request(app.getHttpServer())
        .get(`/towns/${townId}/users`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /towns/:townId', async () => {
      return request(app.getHttpServer())
        .patch(`/towns/${townId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Town',
          description: '',
          x: 500,
          y: 500,
        })
        .expect('');
    });
  });

  describe('Invitations', () => {
    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /invitations/sent', async () => {
      return request(app.getHttpServer())
        .get('/invitations/sent')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /invitations/received', async () => {
      return request(app.getHttpServer())
        .get('/invitations/received')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /invitations/received/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/invitations/received/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /invitations/sent/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/sent/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /invitations/received/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/invitations/received/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('DELETE /residents/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/residents/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Applications', () => {
    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('GET /applications/sent', async () => {
      return request(app.getHttpServer())
        .get('/applications/sent')
        .set('Authorization', `Bearer ${admin.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /applications/received', async () => {
      return request(app.getHttpServer())
        .get('/applications/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('DELETE /applications/received/:userId', async () => {
      return request(app.getHttpServer())
        .delete(`/applications/received/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /applications/sent/:townId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/sent/${townId}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });

    it('POST /applications/received/:userId', async () => {
      return request(app.getHttpServer())
        .post(`/applications/received/${admin.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Residents', () => {
    it('GET /residents/my', async () => {
      return request(app.getHttpServer())
        .get('/residents/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /towns/:townId', async () => {
      return request(app.getHttpServer())
        .delete(`/towns/${townId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Shops', () => {
    it('POST /shops', async () => {
      return request(app.getHttpServer())
        .post('/shops')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          name: 'My Shop',
          description: '',
          x: 500,
          y: -500,
        })
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
        .set('Authorization', `Bearer ${moder.access}`)
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
        .send({
          name: 'My Shop',
          description: '',
          x: 500,
          y: -500,
        })
        .expect('');
    });
  });

  describe('Stations', () => {
    it('POST /stations', async () => {
      return request(app.getHttpServer())
        .post('/stations')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Station',
          description: '',
          x: -500,
          y: -500,
        })
        .expect('');
    });

    it('GET /stations', async () => {
      return request(app.getHttpServer())
        .get('/stations')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stations/my', async () => {
      return request(app.getHttpServer())
        .get('/stations/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (stationId = res.body.result[0].id));
    });

    it('GET /stations/all', async () => {
      return request(app.getHttpServer())
        .get('/stations/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stations/all/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /stations/:stationId', async () => {
      return request(app.getHttpServer())
        .patch(`/stations/${stationId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Station',
          description: '',
          x: -500,
          y: -500,
        })
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
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('POST /goods', async () => {
      return request(app.getHttpServer())
        .post('/goods')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          shopId,
          item: Item.STONE,
          description: '',
          amount: 2,
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
        .get(`/goods/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (goodsId = res.body.result.map((g) => g.id)));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/:shopId/goods', async () => {
      return request(app.getHttpServer())
        .get(`/shops/${shopId}/goods`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: goodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId,
          price: 10,
        })
        .expect('');
    });

    it('POST /purchases', async () => {
      return request(app.getHttpServer())
        .post('/purchases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          goodId: goodsId[0],
          cardId,
          amount: 1,
          rate: 5,
          stationId: 0,
          price: 0,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${goodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
    });

    it('PATCH /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${goodsId[0]}/states`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('DELETE /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .delete(`/goods/${goodsId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .post(`/goods/${goodsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${goodsId[0]}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Purchases', () => {
    it('GET /purchases/my', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (purchasesId = res.body.result.map((b) => b.id)));
    });

    it('GET /purchases/all', async () => {
      return request(app.getHttpServer())
        .get('/purchases/all')
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /purchases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/purchases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /purchases/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/purchases/${user.id}/select`)
        .set('Authorization', `Bearer ${moder.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /goods/:goodId/purchases', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${goodsId[0]}/purchases`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Deliveries', () => {
    it('POST /deliveries', async () => {
      return request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ purchaseId: purchasesId[0], stationId, cardId, price: 10 })
        .expect('');
    });

    it('GET /deliveries', async () => {
      return request(app.getHttpServer())
        .get('/deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /deliveries/my', async () => {
      return request(app.getHttpServer())
        .get(`/deliveries/my?shop=${shopId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (deliveriesId = res.body.result.map((d) => d.id)));
    });

    it('PATCH /deliveries/:deliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/deliveries/${deliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
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

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${moder.access}`)
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

    it('DELETE /deliveries/:shopDeliveryId/take', async () => {
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

    it('DELETE /purchases/:purchaseId', async () => {
      return request(app.getHttpServer())
        .delete(`/purchases/${purchasesId[1]}`)
        .set('Authorization', `Bearer ${moder.access}`)
        .expect('');
    });
  });

  describe('Orders', () => {
    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          stationId,
          cardId,
          item: Item.STONE,
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
          stationId,
          cardId,
          item: Item.STONE,
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

    it('PATCH /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .patch(`/orders/${ordersId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          item: Item.STONE,
          description: '',
          amount: 1,
          intake: 1,
          kit: 1,
          price: 10,
        })
        .expect('');
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

    it('GET /orders/all', async () => {
      return request(app.getHttpServer())
        .get('/orders/all')
        .set('Authorization', `Bearer ${moder.access}`)
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
});
