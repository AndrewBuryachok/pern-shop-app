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

    it('GET /users/all', async () => {
      return request(app.getHttpServer())
        .get('/users/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /users/not-friends/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-friends/select')
        .expect(401);
    });

    it('GET /users/not-followings/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-followings/select')
        .expect(401);
    });

    it('GET /users/not-rated/select', async () => {
      return request(app.getHttpServer())
        .get('/users/not-rated/select')
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

  describe('Followings', () => {
    it('GET /followings/my', async () => {
      return request(app.getHttpServer()).get('/followings/my').expect(401);
    });

    it('GET /followings/received', async () => {
      return request(app.getHttpServer())
        .get('/followings/received')
        .expect(401);
    });
  });

  describe('Articles', () => {
    it('GET /articles/my', async () => {
      return request(app.getHttpServer()).get('/articles/my').expect(401);
    });

    it('GET /articles/liked', async () => {
      return request(app.getHttpServer()).get('/articles/liked').expect(401);
    });

    it('GET /articles/followed', async () => {
      return request(app.getHttpServer()).get('/articles/followed').expect(401);
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

    it('GET /cards/:userId/select', async () => {
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

    it('GET /invoices/received', async () => {
      return request(app.getHttpServer()).get('/invoices/received').expect(401);
    });

    it('GET /invoices/all', async () => {
      return request(app.getHttpServer())
        .get('/invoices/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Cities', () => {
    it('GET /cities/my', async () => {
      return request(app.getHttpServer()).get('/cities/my').expect(401);
    });

    it('GET /cities/all', async () => {
      return request(app.getHttpServer())
        .get('/cities/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /cities/my/select', async () => {
      return request(app.getHttpServer()).get('/cities/my/select').expect(401);
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

  describe('Markets', () => {
    it('GET /markets/my', async () => {
      return request(app.getHttpServer()).get('/markets/my').expect(401);
    });

    it('GET /markets/all', async () => {
      return request(app.getHttpServer())
        .get('/markets/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /markets/my/select', async () => {
      return request(app.getHttpServer()).get('/markets/my/select').expect(401);
    });

    it('GET /markets/all/select', async () => {
      return request(app.getHttpServer())
        .get('/markets/all/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Storages', () => {
    it('GET /storages/my', async () => {
      return request(app.getHttpServer()).get('/storages/my').expect(401);
    });

    it('GET /storages/all', async () => {
      return request(app.getHttpServer())
        .get('/storages/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /storages/my/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/my/select')
        .expect(401);
    });

    it('GET /storages/all/select', async () => {
      return request(app.getHttpServer())
        .get('/storages/all/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Stores', () => {
    it('GET /stores/my', async () => {
      return request(app.getHttpServer()).get('/stores/my').expect(401);
    });

    it('GET /stores/all', async () => {
      return request(app.getHttpServer())
        .get('/stores/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Cells', () => {
    it('GET /cells/my', async () => {
      return request(app.getHttpServer()).get('/cells/my').expect(401);
    });

    it('GET /cells/all', async () => {
      return request(app.getHttpServer())
        .get('/cells/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Rents', () => {
    it('GET /rents/my', async () => {
      return request(app.getHttpServer()).get('/rents/my').expect(401);
    });

    it('GET /rents/placed', async () => {
      return request(app.getHttpServer()).get('/rents/placed').expect(401);
    });

    it('GET /rents/all', async () => {
      return request(app.getHttpServer())
        .get('/rents/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });

    it('GET /rents/my/select', async () => {
      return request(app.getHttpServer()).get('/rents/my/select').expect(401);
    });

    it('GET /rents/all/select', async () => {
      return request(app.getHttpServer())
        .get('/rents/all/select')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Leases', () => {
    it('GET /leases/my', async () => {
      return request(app.getHttpServer()).get('/leases/my').expect(401);
    });

    it('GET /leases/placed', async () => {
      return request(app.getHttpServer()).get('/leases/placed').expect(401);
    });

    it('GET /leases/all', async () => {
      return request(app.getHttpServer())
        .get('/leases/all')
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

  describe('Wares', () => {
    it('GET /wares/my', async () => {
      return request(app.getHttpServer()).get('/wares/my').expect(401);
    });

    it('GET /wares/placed', async () => {
      return request(app.getHttpServer()).get('/wares/placed').expect(401);
    });

    it('GET /wares/all', async () => {
      return request(app.getHttpServer())
        .get('/wares/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Products', () => {
    it('GET /products/my', async () => {
      return request(app.getHttpServer()).get('/products/my').expect(401);
    });

    it('GET /products/placed', async () => {
      return request(app.getHttpServer()).get('/products/placed').expect(401);
    });

    it('GET /products/all', async () => {
      return request(app.getHttpServer())
        .get('/products/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Lots', () => {
    it('GET /lots/my', async () => {
      return request(app.getHttpServer()).get('/lots/my').expect(401);
    });

    it('GET /lots/placed', async () => {
      return request(app.getHttpServer()).get('/lots/placed').expect(401);
    });

    it('GET /lots/all', async () => {
      return request(app.getHttpServer())
        .get('/lots/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Trades', () => {
    it('GET /trades/my', async () => {
      return request(app.getHttpServer()).get('/trades/my').expect(401);
    });

    it('GET /trades/selled', async () => {
      return request(app.getHttpServer()).get('/trades/selled').expect(401);
    });

    it('GET /trades/placed', async () => {
      return request(app.getHttpServer()).get('/trades/placed').expect(401);
    });

    it('GET /trades/all', async () => {
      return request(app.getHttpServer())
        .get('/trades/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Sales', () => {
    it('GET /sales/my', async () => {
      return request(app.getHttpServer()).get('/sales/my').expect(401);
    });

    it('GET /sales/selled', async () => {
      return request(app.getHttpServer()).get('/sales/selled').expect(401);
    });

    it('GET /sales/placed', async () => {
      return request(app.getHttpServer()).get('/sales/placed').expect(401);
    });

    it('GET /sales/all', async () => {
      return request(app.getHttpServer())
        .get('/sales/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Bids', () => {
    it('GET /bids/my', async () => {
      return request(app.getHttpServer()).get('/bids/my').expect(401);
    });

    it('GET /bids/selled', async () => {
      return request(app.getHttpServer()).get('/bids/selled').expect(401);
    });

    it('GET /bids/placed', async () => {
      return request(app.getHttpServer()).get('/bids/placed').expect(401);
    });

    it('GET /bids/all', async () => {
      return request(app.getHttpServer())
        .get('/bids/all')
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

    it('GET /orders/placed', async () => {
      return request(app.getHttpServer()).get('/orders/placed').expect(401);
    });

    it('GET /orders/all', async () => {
      return request(app.getHttpServer())
        .get('/orders/all')
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

    it('GET /deliveries/placed', async () => {
      return request(app.getHttpServer()).get('/deliveries/placed').expect(401);
    });

    it('GET /deliveries/all', async () => {
      return request(app.getHttpServer())
        .get('/deliveries/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Tasks', () => {
    it('GET /tasks/my', async () => {
      return request(app.getHttpServer()).get('/tasks/my').expect(401);
    });

    it('GET /tasks/taken', async () => {
      return request(app.getHttpServer()).get('/tasks/taken').expect(401);
    });

    it('GET /tasks/all', async () => {
      return request(app.getHttpServer())
        .get('/tasks/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Plaints', () => {
    it('GET /plaints/my', async () => {
      return request(app.getHttpServer()).get('/plaints/my').expect(401);
    });

    it('GET /plaints/received', async () => {
      return request(app.getHttpServer()).get('/plaints/received').expect(401);
    });

    it('GET /plaints/all', async () => {
      return request(app.getHttpServer())
        .get('/plaints/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Polls', () => {
    it('GET /polls/my', async () => {
      return request(app.getHttpServer()).get('/polls/my').expect(401);
    });

    it('GET /polls/voted', async () => {
      return request(app.getHttpServer()).get('/polls/voted').expect(401);
    });

    it('GET /polls/all', async () => {
      return request(app.getHttpServer())
        .get('/polls/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });

  describe('Ratings', () => {
    it('GET /ratings/my', async () => {
      return request(app.getHttpServer()).get('/ratings/my').expect(401);
    });

    it('GET /ratings/received', async () => {
      return request(app.getHttpServer()).get('/ratings/received').expect(401);
    });

    it('GET /ratings/all', async () => {
      return request(app.getHttpServer())
        .get('/ratings/all')
        .set('Authorization', `Bearer ${user.access}`)
        .expect(403);
    });
  });
});
