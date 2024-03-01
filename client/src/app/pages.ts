import { lazy } from 'react';
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Donate = lazy(() => import('../pages/common/Donate'));
const Games = lazy(() => import('../pages/common/Games'));
const Map = lazy(() => import('../pages/map/Map'));
const Dynmap = lazy(() => import('../pages/map/Dynmap'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const SingleUser = lazy(() => import('../pages/users/SingleUser'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));
const SubscribersPage = lazy(
  () => import('../pages/subscribers/SubscribersPage'),
);
const IgnorersPage = lazy(() => import('../pages/ignorers/IgnorersPage'));
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
const StoresPage = lazy(() => import('../pages/stores/StoresPage'));
const CellsPage = lazy(() => import('../pages/cells/CellsPage'));
const RentsPage = lazy(() => import('../pages/rents/RentsPage'));
const LeasesPage = lazy(() => import('../pages/leases/LeasesPage'));
const GoodsPage = lazy(() => import('../pages/goods/GoodsPage'));
const WaresPage = lazy(() => import('../pages/wares/WaresPage'));
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'));
const LotsPage = lazy(() => import('../pages/lots/LotsPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
const DeliveriesPage = lazy(() => import('../pages/deliveries/DeliveriesPage'));
const TradesPage = lazy(() => import('../pages/trades/TradesPage'));
const SalesPage = lazy(() => import('../pages/sales/SalesPage'));
const BidsPage = lazy(() => import('../pages/bids/BidsPage'));
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'));
const PlaintsPage = lazy(() => import('../pages/plaints/PlaintsPage'));
const PollsPage = lazy(() => import('../pages/polls/PollsPage'));
const RatingsPage = lazy(() => import('../pages/ratings/RatingsPage'));
import { Role } from '../common/constants';

export const tabs = ['top', 'server', 'site', 'status', 'spawn', 'hub', 'end'];

export const pages = [
  { path: 'donate', element: Donate },
  { path: 'snake', element: Games },
  { path: 'minesweeper', element: Games },
  { path: 'lightsout', element: Games },
  { path: 'memory', element: Games },
  { path: '2048', element: Games },
  { path: 'map', element: Map },
  { path: 'dynmap', element: Dynmap },
  {
    path: 'users',
    element: UsersPage,
    nested: [
      { index: true },
      { path: 'top' },
      { path: 'city' },
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
    path: 'ignorers',
    element: IgnorersPage,
    nested: [{ path: 'top' }, { path: 'my' }, { path: 'received' }],
  },
  {
    path: 'reports',
    element: ReportsPage,
    nested: [
      { index: true },
      { path: 'server' },
      { path: 'site' },
      { path: 'status' },
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
      { path: 'all', role: Role.JUDGE },
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
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'shops',
    element: ShopsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'markets',
    element: MarketsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'storages',
    element: StoragesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'stores',
    element: StoresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'cells',
    element: CellsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'rents',
    element: RentsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'leases',
    element: LeasesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'goods',
    element: GoodsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'wares',
    element: WaresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'products',
    element: ProductsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'lots',
    element: LotsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
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
      { path: 'all', role: Role.MANAGER },
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
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'trades',
    element: TradesPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'sales',
    element: SalesPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'bids',
    element: BidsPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'tasks',
    element: TasksPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'plaints',
    element: PlaintsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'answered' },
      { path: 'all', role: Role.JUDGE },
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
      { path: 'all', role: Role.JUDGE },
    ],
  },
  {
    path: 'ratings',
    element: RatingsPage,
    nested: [
      { path: 'top' },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.JUDGE },
    ],
  },
  { path: '*', element: NotFound },
];
