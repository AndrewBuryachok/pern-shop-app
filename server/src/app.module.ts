import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from 'nest-schedule';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MessagesModule } from './features/messages/messages.module';
import { FriendsModule } from './features/friends/friends.module';
import { SubscribersModule } from './features/subscribers/subscribers.module';
import { ReportsModule } from './features/reports/reports.module';
import { ArticlesModule } from './features/articles/articles.module';
import { PollsModule } from './features/polls/polls.module';
import { CardsModule } from './features/cards/cards.module';
import { ExchangesModule } from './features/exchanges/exchanges.module';
import { PaymentsModule } from './features/payments/payments.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { TownsModule } from './features/towns/towns.module';
import { FarmsModule } from './features/farms/farms.module';
import { ShopsModule } from './features/shops/shops.module';
import { MarketsModule } from './features/markets/markets.module';
import { StoragesModule } from './features/storages/storages.module';
import { StationsModule } from './features/stations/stations.module';
import { MarketsTagsModule } from './features/markets-tags/markets-tags.module';
import { StoragesTagsModule } from './features/storages-tags/storages-tags.module';
import { StallsModule } from './features/stalls/stalls.module';
import { CellsModule } from './features/cells/cells.module';
import { BoxesModule } from './features/boxes/boxes.module';
import { RentsModule } from './features/rents/rents.module';
import { LeasesModule } from './features/leases/leases.module';
import { HiresModule } from './features/hires/hires.module';
import { GoodsModule } from './features/goods/goods.module';
import { WaresModule } from './features/wares/wares.module';
import { ProductsModule } from './features/products/products.module';
import { BargainsModule } from './features/bargains/bargains.module';
import { TradesModule } from './features/trades/trades.module';
import { SalesModule } from './features/sales/sales.module';
import { OrdersModule } from './features/orders/orders.module';
import { HaulagesModule } from './features/haulages/haulages.module';
import { ShopsDeliveriesModule } from './features/shops-deliveries/shops-deliveries.module';
import { MarketsDeliveriesModule } from './features/markets-deliveries/markets-deliveries.module';
import { StoragesDeliveriesModule } from './features/storages-deliveries/storages-deliveries.module';
import { TasksModule } from './features/tasks/tasks.module';
import { AdvertsModule } from './features/adverts/adverts.module';
import { RatingsModule } from './features/ratings/ratings.module';
import { LoggerModule } from './features/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: { url: configService.get('REDIS_URL') },
      }),
    }),
    ScheduleModule.register(),
    AuthModule,
    UsersModule,
    MessagesModule,
    FriendsModule,
    SubscribersModule,
    ReportsModule,
    ArticlesModule,
    PollsModule,
    CardsModule,
    ExchangesModule,
    PaymentsModule,
    InvoicesModule,
    TownsModule,
    FarmsModule,
    ShopsModule,
    MarketsModule,
    StoragesModule,
    StationsModule,
    MarketsTagsModule,
    StoragesTagsModule,
    StallsModule,
    CellsModule,
    BoxesModule,
    RentsModule,
    LeasesModule,
    HiresModule,
    GoodsModule,
    WaresModule,
    ProductsModule,
    BargainsModule,
    TradesModule,
    SalesModule,
    OrdersModule,
    HaulagesModule,
    ShopsDeliveriesModule,
    MarketsDeliveriesModule,
    StoragesDeliveriesModule,
    TasksModule,
    AdvertsModule,
    RatingsModule,
    LoggerModule,
  ],
})
export class AppModule {}
