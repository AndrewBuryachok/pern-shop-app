import { lazy } from 'react';
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Map = lazy(() => import('../pages/map/Map'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const SingleUser = lazy(() => import('../pages/users/SingleUser'));
const ChatsPage = lazy(() => import('../pages/chats/ChatsPage'));
const FriendsPage = lazy(() => import('../pages/friends/FriendsPage'));
const ArticlesPage = lazy(() => import('../pages/articles/ArticlesPage'));
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
const PurchasesPage = lazy(() => import('../pages/purchases/PurchasesPage'));
const DeliveriesPage = lazy(() => import('../pages/deliveries/DeliveriesPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
import { Role } from '../common/constants';

export const pages = [
  { path: 'map', element: Map },
  {
    path: 'users',
    element: UsersPage,
    nested: [
      { index: true },
      { path: 'banned', role: Role.MODER },
      { path: 'all', role: Role.ADMIN },
    ],
  },
  { path: 'users/:nick', element: SingleUser },
  {
    path: 'chats',
    element: ChatsPage,
    nested: [{ path: 'my' }, { path: ':userId' }],
  },
  {
    path: 'friends',
    element: FriendsPage,
    nested: [{ path: 'my' }, { path: 'sent' }, { path: 'received' }],
  },
  {
    path: 'articles',
    element: ArticlesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'cards',
    element: CardsPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.MODER }],
  },
  {
    path: 'exchanges',
    element: ExchangesPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.BANKER }],
  },
  {
    path: 'payments',
    element: PaymentsPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.MODER }],
  },
  {
    path: 'invoices',
    element: InvoicesPage,
    nested: [{ path: 'my' }, { path: 'all', role: Role.MODER }],
  },
  {
    path: 'towns',
    element: TownsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
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
    path: 'shops',
    element: ShopsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'markets',
    element: MarketsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'storages',
    element: StoragesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'stations',
    element: StationsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'markets-tags',
    element: MarketsTagsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'storages-tags',
    element: StoragesTagsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'stalls',
    element: StallsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'cells',
    element: CellsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'boxes',
    element: BoxesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'rents',
    element: RentsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'leases',
    element: LeasesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'hires',
    element: HiresPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'goods',
    element: GoodsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'purchases',
    element: PurchasesPage,
    nested: [
      { path: 'my' },
      { path: 'received' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'deliveries',
    element: DeliveriesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', role: Role.MODER },
    ],
  },
  {
    path: 'orders',
    element: OrdersPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', role: Role.MODER },
    ],
  },
  { path: '*', element: NotFound },
];
