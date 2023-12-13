import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { CardsModule } from './features/cards/cards.module';
import { ExchangesModule } from './features/exchanges/exchanges.module';
import { PaymentsModule } from './features/payments/payments.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { CitiesModule } from './features/cities/cities.module';
import { ShopsModule } from './features/shops/shops.module';
import { MarketsModule } from './features/markets/markets.module';
import { StoragesModule } from './features/storages/storages.module';
import { StoresModule } from './features/stores/stores.module';
import { CellsModule } from './features/cells/cells.module';
import { RentsModule } from './features/rents/rents.module';
import { LeasesModule } from './features/leases/leases.module';
import { GoodsModule } from './features/goods/goods.module';
import { WaresModule } from './features/wares/wares.module';
import { ProductsModule } from './features/products/products.module';
import { LotsModule } from './features/lots/lots.module';
import { OrdersModule } from './features/orders/orders.module';
import { DeliveriesModule } from './features/deliveries/deliveries.module';
import { TradesModule } from './features/trades/trades.module';
import { SalesModule } from './features/sales/sales.module';
import { BidsModule } from './features/bids/bids.module';
import { PollsModule } from './features/polls/polls.module';
import { VotesModule } from './features/votes/votes.module';
import { FriendsModule } from './features/friends/friends.module';
import { RatingsModule } from './features/ratings/ratings.module';
import { TasksModule } from './features/tasks/tasks.module';
import { PlaintsModule } from './features/plaints/plaints.module';

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
    AuthModule,
    UsersModule,
    CardsModule,
    ExchangesModule,
    PaymentsModule,
    InvoicesModule,
    CitiesModule,
    ShopsModule,
    MarketsModule,
    StoragesModule,
    StoresModule,
    CellsModule,
    RentsModule,
    LeasesModule,
    GoodsModule,
    WaresModule,
    ProductsModule,
    LotsModule,
    OrdersModule,
    DeliveriesModule,
    TradesModule,
    SalesModule,
    BidsModule,
    PollsModule,
    VotesModule,
    FriendsModule,
    RatingsModule,
    TasksModule,
    PlaintsModule,
  ],
})
export class AppModule {}
