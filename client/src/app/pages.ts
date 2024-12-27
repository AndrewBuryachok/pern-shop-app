import { lazy } from 'react';
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Home = lazy(() => import('../pages/common/Home'));
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
const PollsPage = lazy(() => import('../pages/polls/PollsPage'));
const CardsPage = lazy(() => import('../pages/cards/CardsPage'));
const ExchangesPage = lazy(() => import('../pages/exchanges/ExchangesPage'));
const PaymentsPage = lazy(() => import('../pages/payments/PaymentsPage'));
const InvoicesPage = lazy(() => import('../pages/invoices/InvoicesPage'));
const TownsPage = lazy(() => import('../pages/towns/TownsPage'));
const ResidentsPage = lazy(() => import('../pages/residents/ResidentsPage'));
const InvitationsPage = lazy(
  () => import('../pages/invitations/InvitationsPage'),
);
const ApplicationsPage = lazy(
  () => import('../pages/applications/ApplicationsPage'),
);
const FarmsPage = lazy(() => import('../pages/farms/FarmsPage'));
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
const StallsPage = lazy(() => import('../pages/stalls/StallsPage'));
const CellsPage = lazy(() => import('../pages/cells/CellsPage'));
const BoxesPage = lazy(() => import('../pages/boxes/BoxesPage'));
const RentsPage = lazy(() => import('../pages/rents/RentsPage'));
const LeasesPage = lazy(() => import('../pages/leases/LeasesPage'));
const HiresPage = lazy(() => import('../pages/hires/HiresPage'));
const GoodsPage = lazy(() => import('../pages/goods/GoodsPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
const HaulagesPage = lazy(() => import('../pages/haulages/HaulagesPage'));
const PurchasesPage = lazy(() => import('../pages/purchases/PurchasesPage'));
const DeliveriesPage = lazy(() => import('../pages/deliveries/DeliveriesPage'));
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'));
const AdvertsPage = lazy(() => import('../pages/adverts/AdvertsPage'));
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
    path: 'polls',
    element: PollsPage,
    nested: [
      { index: true },
      { path: 'my' },
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
    path: 'towns',
    element: TownsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.INSPECTOR },
    ],
  },
  {
    path: 'residents',
    element: ResidentsPage,
    nested: [{ path: 'my' }],
  },
  {
    path: 'invitations',
    element: InvitationsPage,
    nested: [{ path: 'sent' }, { path: 'received' }],
  },
  {
    path: 'applications',
    element: ApplicationsPage,
    nested: [{ path: 'sent' }, { path: 'received' }],
  },
  {
    path: 'farms',
    element: FarmsPage,
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
    path: 'stalls',
    element: StallsPage,
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
    path: 'boxes',
    element: BoxesPage,
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
    path: 'haulages',
    element: HaulagesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'placed' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'purchases',
    element: PurchasesPage,
    nested: [
      { path: 'my' },
      { path: 'sold' },
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
    path: 'tasks',
    element: TasksPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', role: Role.MERCHANT },
    ],
  },
  {
    path: 'adverts',
    element: AdvertsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MERCHANT },
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
