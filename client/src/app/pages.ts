import { lazy } from 'react';
const Home = lazy(() => import('../pages/common/Home'));
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Map = lazy(() => import('../pages/map/Map'));
const Logger = lazy(() => import('../pages/common/Logger'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const SingleUser = lazy(() => import('../pages/users/SingleUser'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));
const SubscribersPage = lazy(
  () => import('../pages/subscribers/SubscribersPage'),
);
const ChatsPage = lazy(() => import('../pages/chats/ChatsPage'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const ArticlesPage = lazy(() => import('../pages/articles/ArticlesPage'));
const CardsPage = lazy(() => import('../pages/cards/CardsPage'));
const ExchangesPage = lazy(() => import('../pages/exchanges/ExchangesPage'));
const PaymentsPage = lazy(() => import('../pages/payments/PaymentsPage'));
const InvoicesPage = lazy(() => import('../pages/invoices/InvoicesPage'));
const CitiesPage = lazy(() => import('../pages/cities/CitiesPage'));
const ShopsPage = lazy(() => import('../pages/shops/ShopsPage'));
const MarketsPage = lazy(() => import('../pages/markets/MarketsPage'));
const StoragesPage = lazy(() => import('../pages/storages/StoragesPage'));
const StationsPage = lazy(() => import('../pages/stations/StationsPage'));
const MarketsTagsPage = lazy(
  () => import('../pages/markets-tags/MarketsTagsPage'),
);
const StoragesTagsPage = lazy(
  () => import('../pages/storages-tags/StoragesTagsPage'),
);
const StoresPage = lazy(() => import('../pages/stores/StoresPage'));
const CellsPage = lazy(() => import('../pages/cells/CellsPage'));
const DrawersPage = lazy(() => import('../pages/drawers/DrawersPage'));
const RentsPage = lazy(() => import('../pages/rents/RentsPage'));
const LeasesPage = lazy(() => import('../pages/leases/LeasesPage'));
const HiresPage = lazy(() => import('../pages/hires/HiresPage'));
const GoodsPage = lazy(() => import('../pages/goods/GoodsPage'));
const WaresPage = lazy(() => import('../pages/wares/WaresPage'));
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
const DeliveriesPage = lazy(() => import('../pages/deliveries/DeliveriesPage'));
const TradesPage = lazy(() => import('../pages/trades/TradesPage'));
const SalesPage = lazy(() => import('../pages/sales/SalesPage'));
const MarketsDeliveriesPage = lazy(
  () => import('../pages/markets-deliveries/MarketsDeliveriesPage'),
);
const StoragesDeliveriesPage = lazy(
  () => import('../pages/storages-deliveries/StoragesDeliveriesPage'),
);
const PollsPage = lazy(() => import('../pages/polls/PollsPage'));
const RatingsPage = lazy(() => import('../pages/ratings/RatingsPage'));
import { Role } from '../common/constants';

export const tabs = ['top', 'server', 'site', 'events', 'spawn', 'hub', 'end'];

export const pages = [
  { index: true, element: Home },
  { path: 'map', element: Map },
  { path: 'logs', element: Logger },
  {
    path: 'users',
    element: UsersPage,
    nested: [
      { index: true },
      { path: 'top' },
      { path: 'my' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  { path: 'users/:nick', element: SingleUser },
  {
    path: 'friends',
    element: FriendsPage,
    nested: [
      { path: 'top' },
      { path: 'my' },
      { path: 'sent' },
      { path: 'received' },
    ],
  },
  {
    path: 'subscribers',
    element: SubscribersPage,
    nested: [{ path: 'top' }, { path: 'my' }, { path: 'received' }],
  },
  {
    path: 'chats',
    element: ChatsPage,
    nested: [{ path: 'my' }, { path: ':nick' }],
  },
  {
    path: 'reports',
    element: ReportsPage,
    nested: [
      { index: true },
      { path: 'server' },
      { path: 'site' },
      { path: 'events' },
      { path: 'spawn' },
      { path: 'hub' },
      { path: 'end' },
    ],
  },
  {
    path: 'articles',
    element: ArticlesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'subscribed' },
      { path: 'liked' },
      { path: 'commented' },
      { path: 'all', role: Role.INSPECTOR },
    ],
  },
  {
    path: 'cards',
    element: CardsPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.BANKER }],
  },
  {
    path: 'exchanges',
    element: ExchangesPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.BANKER }],
  },
  {
    path: 'payments',
    element: PaymentsPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.BANKER }],
  },
  {
    path: 'invoices',
    element: InvoicesPage,
    nested: [
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.BANKER },
    ],
  },
  {
    path: 'cities',
    element: CitiesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.INSPECTOR },
    ],
  },
  {
    path: 'shops',
    element: ShopsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'markets',
    element: MarketsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'storages',
    element: StoragesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'stations',
    element: StationsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'markets-tags',
    element: MarketsTagsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'storages-tags',
    element: StoragesTagsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'stores',
    element: StoresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'cells',
    element: CellsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'drawers',
    element: DrawersPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'rents',
    element: RentsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'leases',
    element: LeasesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'hires',
    element: HiresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'goods',
    element: GoodsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'wares',
    element: WaresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'products',
    element: ProductsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'orders',
    element: OrdersPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'deliveries',
    element: DeliveriesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'trades',
    element: TradesPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'sales',
    element: SalesPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'markets-deliveries',
    element: MarketsDeliveriesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'storages-deliveries',
    element: StoragesDeliveriesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'polls',
    element: PollsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'voted' },
      { path: 'discussed' },
      { path: 'all', role: Role.INSPECTOR },
    ],
  },
  {
    path: 'ratings',
    element: RatingsPage,
    nested: [
      { path: 'top' },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.INSPECTOR },
    ],
  },
  { path: '*', element: NotFound },
];
