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
const TransactionsPage = lazy(
  () => import('../pages/transactions/TransactionsPage'),
);
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
const StationsPage = lazy(() => import('../pages/stations/StationsPage'));
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
      { path: 'top' },
      { path: 'banned', roles: [Role.MODER] },
      { path: 'all', roles: [Role.ADMIN] },
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
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  {
    path: 'cards',
    element: CardsPage,
    nested: [{ path: 'my' }, { path: 'all', roles: [Role.MODER] }],
  },
  {
    path: 'exchanges',
    element: ExchangesPage,
    nested: [{ path: 'my' }, { path: 'all', roles: [Role.BANKER] }],
  },
  {
    path: 'transactions',
    element: TransactionsPage,
    nested: [{ path: 'my' }, { path: 'all', roles: [Role.MODER] }],
  },
  {
    path: 'invoices',
    element: InvoicesPage,
    nested: [{ path: 'my' }, { path: 'all', roles: [Role.MODER] }],
  },
  {
    path: 'towns',
    element: TownsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', roles: [Role.MODER] },
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
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  {
    path: 'stations',
    element: StationsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  {
    path: 'goods',
    element: GoodsPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  {
    path: 'purchases',
    element: PurchasesPage,
    nested: [{ path: 'my' }, { path: 'all', roles: [Role.MODER] }],
  },
  {
    path: 'deliveries',
    element: DeliveriesPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  {
    path: 'orders',
    element: OrdersPage,
    nested: [
      { index: true },
      { path: 'my' },
      { path: 'taken' },
      { path: 'all', roles: [Role.MODER] },
    ],
  },
  { path: '*', element: NotFound },
];
