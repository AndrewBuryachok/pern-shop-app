import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from './database.enum';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { MessagesModule } from './features/messages/messages.module';
import { FriendsModule } from './features/friends/friends.module';
import { ArticlesModule } from './features/articles/articles.module';
import { CardsModule } from './features/cards/cards.module';
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
import { ForumController } from './features/forum/forum.controller';
import { ForumService } from './features/forum/forum.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...Object.values(Database).map((db, index) =>
      TypeOrmModule.forRootAsync({
        name: db,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST').split(',')[index],
          port: +configService.get('DB_PORT').split(',')[index],
          username: configService.get('DB_USERNAME').split(',')[index],
          password: configService.get('DB_PASSWORD').split(',')[index],
          database: configService.get('DB_NAME').split(',')[index],
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
        }),
      }),
    ),
    AuthModule,
    UsersModule,
    MessagesModule,
    FriendsModule,
    ArticlesModule,
    CardsModule,
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
  controllers: [ForumController],
  providers: [ForumService],
})
export class AppModule {}
