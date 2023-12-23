import { lazy } from 'react';
const Home = lazy(() => import('../pages/common/Home'));
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Map = lazy(() => import('../pages/map/Map'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const SingleUser = lazy(() => import('../pages/users/SingleUser'));
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
const PollsPage = lazy(() => import('../pages/polls/PollsPage'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));
const FollowingsPage = lazy(() => import('../pages/followings/FollowingsPage'));
const RatingsPage = lazy(() => import('../pages/ratings/RatingsPage'));
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'));
const PlaintsPage = lazy(() => import('../pages/plaints/PlaintsPage'));
const ArticlesPage = lazy(() => import('../pages/articles/ArticlesPage'));
import { Role } from '../common/constants';

export const pages = [
  { index: true, element: Home },
  { path: 'map', element: Map },
  {
    path: 'users',
    element: UsersPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  { path: 'users/:userId', element: SingleUser },
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
      { path: 'all', role: Role.ADMIN },
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
      { path: 'my' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'leases',
    element: LeasesPage,
    nested: [
      { path: 'my' },
      { path: 'placed' },
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
      { path: 'selled' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'sales',
    element: SalesPage,
    nested: [
      { path: 'my' },
      { path: 'selled' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'bids',
    element: BidsPage,
    nested: [
      { path: 'my' },
      { path: 'selled' },
      { path: 'placed' },
      { path: 'all', role: Role.MANAGER },
    ],
  },
  {
    path: 'polls',
    element: PollsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'voted' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  {
    path: 'friends',
    element: FriendsPage,
    nested: [{ path: 'my' }, { path: 'received' }],
  },
  {
    path: 'followings',
    element: FollowingsPage,
    nested: [{ path: 'my' }, { path: 'received' }],
  },
  {
    path: 'ratings',
    element: RatingsPage,
    nested: [
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  {
    path: 'tasks',
    element: TasksPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  {
    path: 'plaints',
    element: PlaintsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.JUDGE },
    ],
  },
  {
    path: 'articles',
    element: ArticlesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'liked' },
      { path: 'followed' },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  { path: '*', element: NotFound },
];
