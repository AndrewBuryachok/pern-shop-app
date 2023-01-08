import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { CardsModule } from './features/cards/cards.module';
import { ExchangesModule } from './features/exchanges/exchanges.module';
import { PaymentsModule } from './features/payments/payments.module';
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
import { TradesModule } from './features/trades/trades.module';
import { SalesModule } from './features/sales/sales.module';
import { PollsModule } from './features/polls/polls.module';
import { VotesModule } from './features/votes/votes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CardsModule,
    ExchangesModule,
    PaymentsModule,
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
    TradesModule,
    SalesModule,
    PollsModule,
    VotesModule,
  ],
})
export class AppModule {}
