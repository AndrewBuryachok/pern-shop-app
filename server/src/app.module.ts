import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MessagesModule } from './features/messages/messages.module';
import { FriendsModule } from './features/friends/friends.module';
import { ArticlesModule } from './features/articles/articles.module';
import { CardsModule } from './features/cards/cards.module';
import { ExchangesModule } from './features/exchanges/exchanges.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { InvoicesModule } from './features/invoices/invoices.module';
import { TownsModule } from './features/towns/towns.module';
import { ResidentsModule } from './features/residents/residents.module';
import { ShopsModule } from './features/shops/shops.module';
import { StationsModule } from './features/stations/stations.module';
import { GoodsModule } from './features/goods/goods.module';
import { PurchasesModule } from './features/purchases/purchases.module';
import { DeliveriesModule } from './features/deliveries/deliveries.module';
import { OrdersModule } from './features/orders/orders.module';

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
    MessagesModule,
    FriendsModule,
    ArticlesModule,
    CardsModule,
    ExchangesModule,
    TransactionsModule,
    InvoicesModule,
    TownsModule,
    ResidentsModule,
    ShopsModule,
    StationsModule,
    GoodsModule,
    PurchasesModule,
    DeliveriesModule,
    OrdersModule,
  ],
})
export class AppModule {}
