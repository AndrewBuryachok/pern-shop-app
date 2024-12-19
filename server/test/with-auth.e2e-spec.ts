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

describe('With Auth', () => {
  let app: INestApplication;
  let user: Tokens;
  let admin: Tokens;
  let inspector: Tokens;
  let banker: Tokens;
  let merchant: Tokens;
  let spawn: Tokens;
  let hub: Tokens;
  let end: Tokens;
  let messageId: number;
  let reportsId: number;
  let reportCommentId: number;
  let articlesId: number;
  let articleCommentId: number;
  let cardId: number;
  let exchangesId: number;
  let paymentsId: number;
  let invoicesId: number;
  let townId: number;
  let farmId: number;
  let shopId: number;
  let marketId: number;
  let storageId: number;
  let stationId: number;
  let marketTagId: number;
  let storageTagId: number;
  let stallId: number;
  let cellId: number;
  let drawerId: number;
  let rentId: number;
  let leaseId: number;
  let hireId: number;
  let goodId: number;
  let wareId: number;
  let productId: number;
  let bargainsId: number;
  let tradesId: number;
  let salesId: number;
  let ordersId: number;
  let haulagesId: number;
  let shopsDeliveriesId: number;
  let marketsDeliveriesId: number;
  let storagesDeliveriesId: number;
  let tasksId: number;
  let advertId: number;
  let pollsId: number;
  let pollCommentId: number;
  let ratingId: number;

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

    it('POST /auth/login as Inspector', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Inspector', password: 'Inspector' })
        .expect(201)
        .then((res) => (inspector = res.body));
    });

    it('POST /auth/logout as Inspector', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${inspector.access}`)
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

    it('POST /auth/login as Merchant', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'Merchant', password: 'Merchant' })
        .expect(201)
        .then((res) => (merchant = res.body));
    });

    it('POST /auth/logout as Merchant', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect(201);
    });

    it('POST /auth/login as SpawnHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'SpawnHead', password: 'SpawnHead' })
        .expect(201)
        .then((res) => (spawn = res.body));
    });

    it('POST /auth/logout as SpawnHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${spawn.access}`)
        .expect(201);
    });

    it('POST /auth/login as HubHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'HubHead', password: 'HubHead' })
        .expect(201)
        .then((res) => (hub = res.body));
    });

    it('POST /auth/logout as HubHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${hub.access}`)
        .expect(201);
    });

    it('POST /auth/login as EndHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ nick: 'EndHead', password: 'EndHead' })
        .expect(201)
        .then((res) => (end = res.body));
    });

    it('POST /auth/logout as EndHead', async () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${end.access}`)
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
          image: '',
          video: '',
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

    it('GET /users/top', async () => {
      return request(app.getHttpServer())
        .get('/users/top')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/friends', async () => {
      return request(app.getHttpServer())
        .get('/users/friends')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/subscribers', async () => {
      return request(app.getHttpServer())
        .get('/users/subscribers')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /users/ratings', async () => {
      return request(app.getHttpServer())
        .get('/users/ratings')
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

    it('GET /users/not-subscribed/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-subscribed/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /users/not-rated/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-rated/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /users/:userId/profile', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${user.id}/profile`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          avatar: '',
          background: 1,
          discord: '',
          twitch: '',
          youtube: 'string',
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
        .post(`/friends/${user.id}`)
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
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

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

    it('DELETE /friends/:friendId', async () => {
      return request(app.getHttpServer())
        .delete(`/friends/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Subscribers', () => {
    it('POST /subscribers/:subscriberId', async () => {
      return request(app.getHttpServer())
        .post(`/subscribers/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /subscribers/my', async () => {
      return request(app.getHttpServer())
        .get('/subscribers/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /subscribers/received', async () => {
      return request(app.getHttpServer())
        .get('/subscribers/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /subscribers/my/select', async () => {
      return request(app.getHttpServer())
        .get('/subscribers/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          text: 'article text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /articles', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          text: 'article text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('GET /articles/subscribed', async () => {
      return request(app.getHttpServer())
        .get('/articles/subscribed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('DELETE /subscribers/:subscriberId', async () => {
      return request(app.getHttpServer())
        .delete(`/subscribers/${user.id}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Reports', () => {
    it('POST /reports/server', async () => {
      return request(app.getHttpServer())
        .post('/reports/server')
        .set('Authorization', `Bearer ${inspector.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /reports/site', async () => {
      return request(app.getHttpServer())
        .post('/reports/site')
        .set('Authorization', `Bearer ${inspector.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /reports/events', async () => {
      return request(app.getHttpServer())
        .post('/reports/events')
        .set('Authorization', `Bearer ${inspector.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /reports/spawn', async () => {
      return request(app.getHttpServer())
        .post('/reports/spawn')
        .set('Authorization', `Bearer ${spawn.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /reports/hub', async () => {
      return request(app.getHttpServer())
        .post('/reports/hub')
        .set('Authorization', `Bearer ${hub.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('POST /reports/end', async () => {
      return request(app.getHttpServer())
        .post('/reports/end')
        .set('Authorization', `Bearer ${end.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('GET /reports', async () => {
      return request(app.getHttpServer())
        .get('/reports')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (reportsId = res.body.result.map((r) => r.id)));
    });

    it('GET /reports/server', async () => {
      return request(app.getHttpServer())
        .get('/reports/server')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /reports/site', async () => {
      return request(app.getHttpServer())
        .get('/reports/site')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /reports/events', async () => {
      return request(app.getHttpServer())
        .get('/reports/events')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /reports/spawn', async () => {
      return request(app.getHttpServer())
        .get('/reports/spawn')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /reports/hub', async () => {
      return request(app.getHttpServer())
        .get('/reports/hub')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /reports/end', async () => {
      return request(app.getHttpServer())
        .get('/reports/end')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /reports/:reportId/views', async () => {
      return request(app.getHttpServer())
        .post(`/reports/${reportsId[0]}/views`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /reports/:reportId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/reports/${reportsId[0]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: true })
        .expect('');
    });

    it('POST /reports/:reportId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/reports/${reportsId[1]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: false })
        .expect('');
    });

    it('POST /reports-comments', async () => {
      return request(app.getHttpServer())
        .post('/reports-comments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          reportId: reportsId[0],
          commentId: 0,
          text: 'comment text',
        })
        .expect('');
    });

    it('GET /reports/viewed/select', async () => {
      return request(app.getHttpServer())
        .get('/reports/viewed/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /reports/liked/select', async () => {
      return request(app.getHttpServer())
        .get('/reports/liked/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) =>
          expect(res.body.up.length + res.body.down.length).toBeGreaterThan(0),
        );
    });

    it('GET /reports/:reportId/views', async () => {
      return request(app.getHttpServer())
        .get(`/reports/${reportsId[0]}/views`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /reports/:reportId/likes', async () => {
      return request(app.getHttpServer())
        .get(`/reports/${reportsId[0]}/likes`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /reports-comments/:reportId', async () => {
      return request(app.getHttpServer())
        .get(`/reports-comments/${reportsId[0]}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (reportCommentId = res.body[0].id));
    });

    it('PATCH /reports/:reportId', async () => {
      return request(app.getHttpServer())
        .patch(`/reports/${reportsId[0]}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .send({
          text: 'report text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
        .expect('');
    });

    it('DELETE /reports/:reportId', async () => {
      return request(app.getHttpServer())
        .delete(`/reports/${reportsId[1]}`)
        .set('Authorization', `Bearer ${admin.access}`)
        .expect('');
    });
  });

  describe('Reports Comments', () => {
    it('PATCH /reports-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .patch(`/reports-comments/${reportCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'comment text' })
        .expect('');
    });

    it('DELETE /reports-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .delete(`/reports-comments/${reportCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Articles', () => {
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

    it('POST /articles-comments', async () => {
      return request(app.getHttpServer())
        .post('/articles-comments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ articleId: articlesId[0], commentId: 0, text: 'comment text' })
        .expect('');
    });

    it('GET /articles/liked', async () => {
      return request(app.getHttpServer())
        .get('/articles/liked')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/commented', async () => {
      return request(app.getHttpServer())
        .get('/articles/commented')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /articles/viewed/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/viewed/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /articles/liked/select', async () => {
      return request(app.getHttpServer())
        .get('/articles/liked/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) =>
          expect(res.body.up.length + res.body.down.length).toBeGreaterThan(0),
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

    it('GET /articles-comments/:articleId', async () => {
      return request(app.getHttpServer())
        .get(`/articles-comments/${articlesId[0]}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (articleCommentId = res.body[0].id));
    });

    it('GET /articles/all', async () => {
      return request(app.getHttpServer())
        .get('/articles/all')
        .set('Authorization', `Bearer ${inspector.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('PATCH /articles/:articleId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${articlesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          text: 'article text',
          image1: '',
          image2: '',
          image3: '',
          video: '',
        })
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
    it('PATCH /articles-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .patch(`/articles-comments/${articleCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'comment text' })
        .expect('');
    });

    it('DELETE /articles-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .delete(`/articles-comments/${articleCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Polls', () => {
    it('POST /polls', async () => {
      return request(app.getHttpServer())
        .post('/polls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'poll text', mark: 1, image: '', video: '' })
        .expect('');
    });

    it('POST /polls', async () => {
      return request(app.getHttpServer())
        .post('/polls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'poll text', mark: 2, image: '', video: '' })
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

    it('PATCH /polls/:pollId', async () => {
      return request(app.getHttpServer())
        .patch(`/polls/${pollsId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'poll text', mark: 1, image: '', video: '' })
        .expect('');
    });

    it('POST /polls/:pollId/views', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[0]}/views`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /polls/:pollId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[0]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: true })
        .expect('');
    });

    it('POST /polls/:pollId/likes', async () => {
      return request(app.getHttpServer())
        .post(`/polls/${pollsId[1]}/likes`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ type: false })
        .expect('');
    });

    it('POST /polls-comments', async () => {
      return request(app.getHttpServer())
        .post('/polls-comments')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ pollId: pollsId[0], commentId: 0, text: 'comment text' })
        .expect('');
    });

    it('GET /polls/liked', async () => {
      return request(app.getHttpServer())
        .get('/polls/liked')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /polls/commented', async () => {
      return request(app.getHttpServer())
        .get('/polls/commented')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /polls/viewed/select', async () => {
      return request(app.getHttpServer())
        .get('/polls/viewed/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /polls/liked/select', async () => {
      return request(app.getHttpServer())
        .get('/polls/liked/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) =>
          expect(res.body.up.length + res.body.down.length).toBeGreaterThan(0),
        );
    });

    it('GET /polls/:pollId/views', async () => {
      return request(app.getHttpServer())
        .get(`/polls/${pollsId[0]}/views`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /polls/:pollId/likes', async () => {
      return request(app.getHttpServer())
        .get(`/polls/${pollsId[0]}/likes`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /polls-comments/:pollId', async () => {
      return request(app.getHttpServer())
        .get(`/polls-comments/${pollsId[0]}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0))
        .then((res) => (pollCommentId = res.body[0].id));
    });

    it('GET /polls/all', async () => {
      return request(app.getHttpServer())
        .get('/polls/all')
        .set('Authorization', `Bearer ${inspector.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });
  });

  describe('Polls Comments', () => {
    it('PATCH /polls-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .patch(`/polls-comments/${pollCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ text: 'comment text' })
        .expect('');
    });

    it('DELETE /polls-comments/:commentId', async () => {
      return request(app.getHttpServer())
        .delete(`/polls-comments/${pollCommentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
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
        .set('Authorization', `Bearer ${inspector.access}`)
        .send({ type: true })
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
        .set('Authorization', `Bearer ${banker.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (paymentsId = res.body.result.map((p) => p.id)));
    });

    it('DELETE /payments/:paymentId', async () => {
      return request(app.getHttpServer())
        .delete(`/payments/${paymentsId[0]}`)
        .set('Authorization', `Bearer ${banker.access}`)
        .expect('');
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
        .set('Authorization', `Bearer ${admin.access}`)
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
          image: '',
          video: '',
          description: '',
          x: 500,
          y: 500,
        })
        .expect('');
    });

    it('POST /towns/:townId/users', async () => {
      return request(app.getHttpServer())
        .post(`/towns/${townId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });

    it('DELETE /towns/:townId/users', async () => {
      return request(app.getHttpServer())
        .delete(`/towns/${townId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });
  });

  describe('Farms', () => {
    it('POST /farms', async () => {
      return request(app.getHttpServer())
        .post('/farms')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Farm',
          image: '',
          video: '',
          description: '',
          x: 500,
          y: -500,
        })
        .expect('');
    });

    it('GET /farms', async () => {
      return request(app.getHttpServer())
        .get('/farms')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /farms/my', async () => {
      return request(app.getHttpServer())
        .get('/farms/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (farmId = res.body.result[0].id));
    });

    it('GET /farms/all', async () => {
      return request(app.getHttpServer())
        .get('/farms/all')
        .set('Authorization', `Bearer ${inspector.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /farms/all/select', async () => {
      return request(app.getHttpServer())
        .get('/farms/all/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /farms/:farmId/users', async () => {
      return request(app.getHttpServer())
        .get(`/farms/${farmId}/users`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /farms/:farmId', async () => {
      return request(app.getHttpServer())
        .patch(`/farms/${farmId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Farm',
          image: '',
          video: '',
          description: '',
          x: 500,
          y: -500,
        })
        .expect('');
    });

    it('POST /farms/:farmId/users', async () => {
      return request(app.getHttpServer())
        .post(`/farms/${farmId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
        .expect('');
    });

    it('DELETE /farms/:farmId/users', async () => {
      return request(app.getHttpServer())
        .delete(`/farms/${farmId}/users`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ userId: admin.id })
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
          image: '',
          video: '',
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
        .set('Authorization', `Bearer ${merchant.access}`)
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
          image: '',
          video: '',
          description: '',
          x: 500,
          y: -500,
        })
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
          video: '',
          description: '',
          x: -500,
          y: 500,
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
        .set('Authorization', `Bearer ${merchant.access}`)
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /markets/:marketId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets/${marketId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Market',
          image: '',
          video: '',
          description: '',
          x: -500,
          y: 500,
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
          video: '',
          description: '',
          x: -500,
          y: -500,
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
        .set('Authorization', `Bearer ${merchant.access}`)
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /storages/:storageId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages/${storageId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Storage',
          image: '',
          video: '',
          description: '',
          x: -500,
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
          cardId,
          name: 'My Station',
          image: '',
          video: '',
          description: '',
          x: -500,
          y: -500,
          price: 5,
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stations/main/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/main/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stations/my/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stations/all/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /stations/:stationId', async () => {
      return request(app.getHttpServer())
        .patch(`/stations/${stationId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Station',
          image: '',
          video: '',
          description: '',
          x: -500,
          y: -500,
          price: 10,
        })
        .expect('');
    });

    it('GET /stations/:stationId/states', async () => {
      return request(app.getHttpServer())
        .get(`/stations/${stationId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Markets Tags', () => {
    it('POST /markets-tags', async () => {
      return request(app.getHttpServer())
        .post('/markets-tags')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          marketId,
          name: 'My Tag',
          price: 5,
        })
        .expect('');
    });

    it('GET /markets-tags', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-tags/my', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (marketTagId = res.body.result[0].id));
    });

    it('GET /markets-tags/all', async () => {
      return request(app.getHttpServer())
        .get('/markets-tags/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-tags/:marketId/select', async () => {
      return request(app.getHttpServer())
        .get(`/markets-tags/${marketId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /markets-tags/:marketTagId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets-tags/${marketTagId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Tag',
          price: 10,
        })
        .expect('');
    });

    it('GET /markets-tags/:marketTagId/states', async () => {
      return request(app.getHttpServer())
        .get(`/markets-tags/${marketTagId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Storages Tags', () => {
    it('POST /storages-tags', async () => {
      return request(app.getHttpServer())
        .post('/storages-tags')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          storageId,
          name: 'My Tag',
          price: 5,
        })
        .expect('');
    });

    it('GET /storages-tags', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-tags/my', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (storageTagId = res.body.result[0].id));
    });

    it('GET /storages-tags/all', async () => {
      return request(app.getHttpServer())
        .get('/storages-tags/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-tags/:storageId/select', async () => {
      return request(app.getHttpServer())
        .get(`/storages-tags/${storageId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /storages-tags/:storageTagId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages-tags/${storageTagId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          name: 'My Tag',
          price: 10,
        })
        .expect('');
    });

    it('GET /storages-tags/:storageTagId/states', async () => {
      return request(app.getHttpServer())
        .get(`/storages-tags/${storageTagId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Stalls', () => {
    it('POST /stalls', async () => {
      return request(app.getHttpServer())
        .post('/stalls')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ marketTagId })
        .expect('');
    });

    it('GET /stalls', async () => {
      return request(app.getHttpServer())
        .get('/stalls')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stalls/my', async () => {
      return request(app.getHttpServer())
        .get('/stalls/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (stallId = res.body.result[0].id));
    });

    it('GET /stalls/all', async () => {
      return request(app.getHttpServer())
        .get('/stalls/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /stalls/:marketId/markets', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${marketId}/markets`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stalls/:marketTagId/tags', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${marketTagId}/tags`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /stalls/:stallId/tag', async () => {
      return request(app.getHttpServer())
        .get(`/stalls/${stallId}/tag`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });
  });

  describe('Cells', () => {
    it('POST /cells', async () => {
      return request(app.getHttpServer())
        .post('/cells')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ storageTagId })
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
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (cellId = res.body.result[0].id));
    });

    it('GET /cells/all', async () => {
      return request(app.getHttpServer())
        .get('/cells/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /cells/:storageId/storages', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${storageId}/storages`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cells/:storageTagId/tags', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${storageTagId}/tags`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /cells/:cellId/tag', async () => {
      return request(app.getHttpServer())
        .get(`/cells/${cellId}/tag`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });
  });

  describe('Drawers', () => {
    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('GET /drawers', async () => {
      return request(app.getHttpServer())
        .get('/drawers')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /drawers/my', async () => {
      return request(app.getHttpServer())
        .get('/drawers/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (drawerId = res.body.result[0].id));
    });

    it('GET /drawers/all', async () => {
      return request(app.getHttpServer())
        .get('/drawers/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /drawers/:stationId/select', async () => {
      return request(app.getHttpServer())
        .get(`/drawers/${stationId}/select`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /drawers/:drawerId/station', async () => {
      return request(app.getHttpServer())
        .get(`/drawers/${drawerId}/station`)
        .expect((res) => expect(res.body.id).toBeGreaterThan(0));
    });

    it('GET /stations/free/select', async () => {
      return request(app.getHttpServer())
        .get('/stations/free/select')
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Rents', () => {
    it('POST /rents', async () => {
      return request(app.getHttpServer())
        .post('/rents')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stallId, cardId })
        .expect('');
    });

    it('GET /rents', async () => {
      return request(app.getHttpServer())
        .get('/rents')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/my', async () => {
      return request(app.getHttpServer())
        .get('/rents/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (rentId = res.body.result[0].id));
    });

    it('GET /rents/received', async () => {
      return request(app.getHttpServer())
        .get('/rents/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /rents/all', async () => {
      return request(app.getHttpServer())
        .get('/rents/all')
        .set('Authorization', `Bearer ${merchant.access}`)
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
        .set('Authorization', `Bearer ${merchant.access}`)
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
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /rents/:rentId/things', async () => {
      return request(app.getHttpServer())
        .get(`/rents/${rentId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Leases', () => {
    it('POST /leases', async () => {
      return request(app.getHttpServer())
        .post('/leases')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cellId, cardId })
        .expect('');
    });

    it('GET /leases', async () => {
      return request(app.getHttpServer())
        .get('/leases')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/my', async () => {
      return request(app.getHttpServer())
        .get('/leases/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (leaseId = res.body.result[0].id));
    });

    it('GET /leases/received', async () => {
      return request(app.getHttpServer())
        .get('/leases/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/all', async () => {
      return request(app.getHttpServer())
        .get('/leases/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /leases/my/select', async () => {
      return request(app.getHttpServer())
        .get('/leases/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /leases/all/select', async () => {
      return request(app.getHttpServer())
        .get('/leases/all/select')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /products', async () => {
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          leaseId,
          item: 1,
          description: '',
          amount: 2,
          intake: 1,
          kit: 1,
          price: 5,
        })
        .expect('');
    });

    it('GET /leases/:leaseId/things', async () => {
      return request(app.getHttpServer())
        .get(`/leases/${leaseId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
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
        .get('/goods/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (goodId = res.body.result[0].id));
    });

    it('GET /goods/all', async () => {
      return request(app.getHttpServer())
        .get('/goods/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops/:shopId/goods', async () => {
      return request(app.getHttpServer())
        .get(`/shops/${shopId}/goods`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /bargains', async () => {
      return request(app.getHttpServer())
        .post('/bargains')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ goodId, cardId, amount: 1, stationId, price: 10 })
        .expect('');
    });

    it('POST /bargains', async () => {
      return request(app.getHttpServer())
        .post('/bargains')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ goodId, cardId, amount: 1, stationId: 0, price: 0 })
        .expect('');
    });

    it('PATCH /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .patch(`/goods/${goodId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('POST /goods/:goodId', async () => {
      return request(app.getHttpServer())
        .post(`/goods/${goodId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /goods/:goodId/states', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${goodId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /trades', async () => {
      return request(app.getHttpServer())
        .post('/trades')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ wareId, cardId, amount: 1, stationId, price: 10 })
        .expect('');
    });

    it('POST /trades', async () => {
      return request(app.getHttpServer())
        .post('/trades')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ wareId, cardId, amount: 1, stationId: 0, price: 0 })
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

    it('GET /wares/:wareId/states', async () => {
      return request(app.getHttpServer())
        .get(`/wares/${wareId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /rents/:rentId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/rents/${rentId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /rents/:rentId', async () => {
      return request(app.getHttpServer())
        .post(`/rents/${rentId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Products', () => {
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /sales', async () => {
      return request(app.getHttpServer())
        .post('/sales')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ productId, cardId, amount: 1, stationId, price: 10 })
        .expect('');
    });

    it('POST /sales', async () => {
      return request(app.getHttpServer())
        .post('/sales')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ productId, cardId, amount: 1, stationId: 0, price: 0 })
        .expect('');
    });

    it('PATCH /products/:productId', async () => {
      return request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ amount: 1, price: 10 })
        .expect('');
    });

    it('POST /products/:productId', async () => {
      return request(app.getHttpServer())
        .post(`/products/${productId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /products/:productId/states', async () => {
      return request(app.getHttpServer())
        .get(`/products/${productId}/states`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('POST /leases/:leaseId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/leases/${leaseId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /leases/:leaseId', async () => {
      return request(app.getHttpServer())
        .post(`/leases/${leaseId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Bargains', () => {
    it('GET /bargains/my', async () => {
      return request(app.getHttpServer())
        .get('/bargains/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (bargainsId = res.body.result.map((b) => b.id)));
    });

    it('GET /bargains/sold', async () => {
      return request(app.getHttpServer())
        .get('/bargains/sold')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /bargains/all', async () => {
      return request(app.getHttpServer())
        .get('/bargains/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /bargains/my/select', async () => {
      return request(app.getHttpServer())
        .get('/bargains/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /bargains/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/bargains/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /bargains/:bargainId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/bargains/${bargainsId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('GET /goods/:goodId/rating', async () => {
      return request(app.getHttpServer())
        .get(`/goods/${goodId}/rating`)
        .expect((res) => expect(res.body.rate).toBeGreaterThan(0));
    });
  });

  describe('Trades', () => {
    it('GET /trades/my', async () => {
      return request(app.getHttpServer())
        .get('/trades/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (tradesId = res.body.result.map((t) => t.id)));
    });

    it('GET /trades/sold', async () => {
      return request(app.getHttpServer())
        .get('/trades/sold')
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /trades/my/select', async () => {
      return request(app.getHttpServer())
        .get('/trades/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /trades/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/trades/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /trades/:tradeId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/trades/${tradesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('GET /wares/:wareId/rating', async () => {
      return request(app.getHttpServer())
        .get(`/wares/${wareId}/rating`)
        .expect((res) => expect(res.body.rate).toBeGreaterThan(0));
    });
  });

  describe('Sales', () => {
    it('GET /sales/my', async () => {
      return request(app.getHttpServer())
        .get('/sales/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (salesId = res.body.result.map((s) => s.id)));
    });

    it('GET /sales/sold', async () => {
      return request(app.getHttpServer())
        .get('/sales/sold')
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
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /sales/my/select', async () => {
      return request(app.getHttpServer())
        .get('/sales/my/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('GET /sales/:userId/select', async () => {
      return request(app.getHttpServer())
        .get(`/sales/${user.id}/select`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });

    it('PATCH /sales/:saleId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/sales/${salesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('GET /products/:productId/rating', async () => {
      return request(app.getHttpServer())
        .get(`/products/${productId}/rating`)
        .expect((res) => expect(res.body.rate).toBeGreaterThan(0));
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
          stationId,
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

    it('PATCH /orders/:orderId', async () => {
      return request(app.getHttpServer())
        .patch(`/orders/${ordersId[0]}`)
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
        .set('Authorization', `Bearer ${merchant.access}`)
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

  describe('Haulages', () => {
    it('POST /haulages', async () => {
      return request(app.getHttpServer())
        .post('/haulages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStationId: stationId,
          toStationId: stationId,
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

    it('POST /haulages', async () => {
      return request(app.getHttpServer())
        .post('/haulages')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          fromStationId: stationId,
          toStationId: stationId,
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

    it('GET /haulages', async () => {
      return request(app.getHttpServer())
        .get('/haulages')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/my', async () => {
      return request(app.getHttpServer())
        .get('/haulages/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (haulagesId = res.body.result.map((d) => d.id)));
    });

    it('PATCH /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .patch(`/haulages/${haulagesId[0]}`)
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

    it('POST /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /haulages/taken', async () => {
      return request(app.getHttpServer())
        .get('/haulages/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/placed', async () => {
      return request(app.getHttpServer())
        .get('/haulages/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /haulages/all', async () => {
      return request(app.getHttpServer())
        .get('/haulages/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /haulages/:haulageId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /haulages/:haulageId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/haulages/${haulagesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .post(`/haulages/${haulagesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /haulages/:haulageId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/haulages/${haulagesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /haulages/:haulageId', async () => {
      return request(app.getHttpServer())
        .delete(`/haulages/${haulagesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Shops Deliveries', () => {
    it('POST /shops-deliveries', async () => {
      return request(app.getHttpServer())
        .post('/shops-deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ bargainId: bargainsId[0], stationId, cardId, price: 10 })
        .expect('');
    });

    it('GET /shops-deliveries', async () => {
      return request(app.getHttpServer())
        .get('/shops-deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops-deliveries/my', async () => {
      return request(app.getHttpServer())
        .get('/shops-deliveries/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (shopsDeliveriesId = res.body.result.map((d) => d.id)));
    });

    it('PATCH /shops-deliveries/:shopDeliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/shops-deliveries/${shopsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /shops-deliveries/:shopDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/shops-deliveries/${shopsDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /shops-deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/shops-deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops-deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/shops-deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /shops-deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/shops-deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /shops-deliveries/:shopDeliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/shops-deliveries/${shopsDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /shops-deliveries/:shopDeliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/shops-deliveries/${shopsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /shops-deliveries/:shopDeliveryId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/shops-deliveries/${shopsDeliveriesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /shops-deliveries/:shopDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/shops-deliveries/${shopsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /shops-deliveries/:shopDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/shops-deliveries/${shopsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /shops-deliveries/:shopDeliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/shops-deliveries/${shopsDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /bargains/:bargainId', async () => {
      return request(app.getHttpServer())
        .delete(`/bargains/${bargainsId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Markets Deliveries', () => {
    it('POST /markets-deliveries', async () => {
      return request(app.getHttpServer())
        .post('/markets-deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ tradeId: tradesId[0], stationId, cardId, price: 10 })
        .expect('');
    });

    it('GET /markets-deliveries', async () => {
      return request(app.getHttpServer())
        .get('/markets-deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-deliveries/my', async () => {
      return request(app.getHttpServer())
        .get('/markets-deliveries/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then(
          (res) => (marketsDeliveriesId = res.body.result.map((d) => d.id)),
        );
    });

    it('PATCH /markets-deliveries/:marketDeliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/markets-deliveries/${marketsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /markets-deliveries/:marketDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/markets-deliveries/${marketsDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /markets-deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/markets-deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/markets-deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /markets-deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/markets-deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /markets-deliveries/:marketDeliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/markets-deliveries/${marketsDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /markets-deliveries/:marketDeliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/markets-deliveries/${marketsDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /markets-deliveries/:marketDeliveryId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/markets-deliveries/${marketsDeliveriesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /markets-deliveries/:marketDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/markets-deliveries/${marketsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /markets-deliveries/:marketDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/markets-deliveries/${marketsDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /markets-deliveries/:marketDeliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/markets-deliveries/${marketsDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /trades/:tradeId', async () => {
      return request(app.getHttpServer())
        .delete(`/trades/${tradesId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Storages Deliveries', () => {
    it('POST /storages-deliveries', async () => {
      return request(app.getHttpServer())
        .post('/storages-deliveries')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ saleId: salesId[0], stationId, cardId, price: 10 })
        .expect('');
    });

    it('GET /storages-deliveries', async () => {
      return request(app.getHttpServer())
        .get('/storages-deliveries')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-deliveries/my', async () => {
      return request(app.getHttpServer())
        .get('/storages-deliveries/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then(
          (res) => (storagesDeliveriesId = res.body.result.map((d) => d.id)),
        );
    });

    it('PATCH /storages-deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .patch(`/storages-deliveries/${storagesDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ price: 10 })
        .expect('');
    });

    it('POST /storages-deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/storages-deliveries/${storagesDeliveriesId[0]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('GET /storages-deliveries/taken', async () => {
      return request(app.getHttpServer())
        .get('/storages-deliveries/taken')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-deliveries/placed', async () => {
      return request(app.getHttpServer())
        .get('/storages-deliveries/placed')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /storages-deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/storages-deliveries/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /storages-deliveries/:storageDeliveryId/execute', async () => {
      return request(app.getHttpServer())
        .post(`/storages-deliveries/${storagesDeliveriesId[0]}/execute`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /storages-deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .post(`/storages-deliveries/${storagesDeliveriesId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('PATCH /storages-deliveries/:storageDeliveryId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/storages-deliveries/${storagesDeliveriesId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
        .expect('');
    });

    it('POST /storages-deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .post(`/storages-deliveries/${storagesDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ cardId })
        .expect('');
    });

    it('DELETE /storages-deliveries/:storageDeliveryId/take', async () => {
      return request(app.getHttpServer())
        .delete(`/storages-deliveries/${storagesDeliveriesId[1]}/take`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /storages-deliveries/:storageDeliveryId', async () => {
      return request(app.getHttpServer())
        .delete(`/storages-deliveries/${storagesDeliveriesId[1]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('DELETE /sales/:saleId', async () => {
      return request(app.getHttpServer())
        .delete(`/sales/${salesId[1]}`)
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect('');
    });
  });

  describe('Hires', () => {
    it('POST /drawers', async () => {
      return request(app.getHttpServer())
        .post('/drawers')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ stationId })
        .expect('');
    });

    it('POST /orders', async () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          stationId,
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

    it('GET /hires', async () => {
      return request(app.getHttpServer())
        .get('/hires')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /hires/my', async () => {
      return request(app.getHttpServer())
        .get('/hires/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (hireId = res.body.result[0].id));
    });

    it('GET /hires/received', async () => {
      return request(app.getHttpServer())
        .get('/hires/received')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /hires/all', async () => {
      return request(app.getHttpServer())
        .get('/hires/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /hires/:hireId/continue', async () => {
      return request(app.getHttpServer())
        .post(`/hires/${hireId}/continue`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('POST /hires/:hireId', async () => {
      return request(app.getHttpServer())
        .post(`/hires/${hireId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });

    it('GET /hires/:hireId/things', async () => {
      return request(app.getHttpServer())
        .get(`/hires/${hireId}/things`)
        .expect((res) => expect(res.body.length).toBeGreaterThan(0));
    });
  });

  describe('Tasks', () => {
    it('POST /tasks', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          activity: 'activity',
          text: 'text',
          price: 10,
        })
        .expect('');
    });

    it('POST /tasks', async () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          activity: 'activity',
          text: 'text',
          price: 10,
        })
        .expect('');
    });

    it('GET /tasks', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /tasks/my', async () => {
      return request(app.getHttpServer())
        .get('/tasks/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (tasksId = res.body.result.map((o) => o.id)));
    });

    it('PATCH /tasks/:taskId', async () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${tasksId[0]}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          activity: 'activity',
          text: 'text',
          price: 10,
        })
        .expect('');
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

    it('GET /tasks/all', async () => {
      return request(app.getHttpServer())
        .get('/tasks/all')
        .set('Authorization', `Bearer ${merchant.access}`)
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

    it('PATCH /tasks/:taskId/rate', async () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${tasksId[0]}/rate`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({ rate: 5 })
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

  describe('Adverts', () => {
    it('POST /adverts', async () => {
      return request(app.getHttpServer())
        .post('/adverts')
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          activity: 'activity',
          text: 'text',
          price: 5,
        })
        .expect('');
    });

    it('GET /adverts', async () => {
      return request(app.getHttpServer())
        .get('/adverts')
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('GET /adverts/my', async () => {
      return request(app.getHttpServer())
        .get('/adverts/my')
        .set('Authorization', `Bearer ${user.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0))
        .then((res) => (advertId = res.body.result[0].id));
    });

    it('GET /adverts/all', async () => {
      return request(app.getHttpServer())
        .get('/adverts/all')
        .set('Authorization', `Bearer ${merchant.access}`)
        .expect((res) => expect(res.body.count).toBeGreaterThan(0));
    });

    it('POST /adverts/:advertId', async () => {
      return request(app.getHttpServer())
        .post(`/adverts/${advertId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          cardId,
          activity: 'activity',
          text: 'text',
          price: 10,
        })
        .expect('');
    });

    it('PATCH /adverts/:advertId', async () => {
      return request(app.getHttpServer())
        .patch(`/adverts/${advertId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .send({
          activity: 'activity',
          text: 'text',
          price: 10,
        })
        .expect('');
    });

    it('DELETE /adverts/:advertId', async () => {
      return request(app.getHttpServer())
        .delete(`/adverts/${advertId}`)
        .set('Authorization', `Bearer ${user.access}`)
        .expect('');
    });
  });

  describe('Ratings', () => {
    it('POST /ratings', async () => {
      return request(app.getHttpServer())
        .post('/ratings')
        .set('Authorization', `Bearer ${user.access}`)
        .send({ receiverUserId: admin.id, rate: 5 })
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
        .set('Authorization', `Bearer ${admin.access}`)
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
});
