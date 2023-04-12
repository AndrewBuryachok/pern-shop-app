import { lazy } from 'react';
const Home = lazy(() => import('../pages/common/Home'));
const NotFound = lazy(() => import('../pages/common/NotFound'));
const Map = lazy(() => import('../pages/map/Map'));
const MainUsers = lazy(() => import('../pages/users/MainUsers'));
const MyUsers = lazy(() => import('../pages/users/MyUsers'));
const AllUsers = lazy(() => import('../pages/users/AllUsers'));
const SingleUser = lazy(() => import('../pages/users/SingleUser'));
const MyCards = lazy(() => import('../pages/cards/MyCards'));
const AllCards = lazy(() => import('../pages/cards/AllCards'));
const MyExchanges = lazy(() => import('../pages/exchanges/MyExchanges'));
const AllExchanges = lazy(() => import('../pages/exchanges/AllExchanges'));
const MyPayments = lazy(() => import('../pages/payments/MyPayments'));
const AllPayments = lazy(() => import('../pages/payments/AllPayments'));
const MyInvoices = lazy(() => import('../pages/invoices/MyInvoices'));
const AllInvoices = lazy(() => import('../pages/invoices/AllInvoices'));
const MainCities = lazy(() => import('../pages/cities/MainCities'));
const MyCities = lazy(() => import('../pages/cities/MyCities'));
const AllCities = lazy(() => import('../pages/cities/AllCities'));
const MainShops = lazy(() => import('../pages/shops/MainShops'));
const MyShops = lazy(() => import('../pages/shops/MyShops'));
const AllShops = lazy(() => import('../pages/shops/AllShops'));
const MainMarkets = lazy(() => import('../pages/markets/MainMarkets'));
const MyMarkets = lazy(() => import('../pages/markets/MyMarkets'));
const AllMarkets = lazy(() => import('../pages/markets/AllMarkets'));
const MainStorages = lazy(() => import('../pages/storages/MainStorages'));
const MyStorages = lazy(() => import('../pages/storages/MyStorages'));
const AllStorages = lazy(() => import('../pages/storages/AllStorages'));
const MainStores = lazy(() => import('../pages/stores/MainStores'));
const MyStores = lazy(() => import('../pages/stores/MyStores'));
const AllStores = lazy(() => import('../pages/stores/AllStores'));
const MainCells = lazy(() => import('../pages/cells/MainCells'));
const MyCells = lazy(() => import('../pages/cells/MyCells'));
const AllCells = lazy(() => import('../pages/cells/AllCells'));
const MyRents = lazy(() => import('../pages/rents/MyRents'));
const AllRents = lazy(() => import('../pages/rents/AllRents'));
const MyLeases = lazy(() => import('../pages/leases/MyLeases'));
const AllLeases = lazy(() => import('../pages/leases/AllLeases'));
const MainGoods = lazy(() => import('../pages/goods/MainGoods'));
const MyGoods = lazy(() => import('../pages/goods/MyGoods'));
const AllGoods = lazy(() => import('../pages/goods/AllGoods'));
const MainWares = lazy(() => import('../pages/wares/MainWares'));
const MyWares = lazy(() => import('../pages/wares/MyWares'));
const PlacedWares = lazy(() => import('../pages/wares/PlacedWares'));
const AllWares = lazy(() => import('../pages/wares/AllWares'));
const MainProducts = lazy(() => import('../pages/products/MainProducts'));
const MyProducts = lazy(() => import('../pages/products/MyProducts'));
const PlacedProducts = lazy(() => import('../pages/products/PlacedProducts'));
const AllProducts = lazy(() => import('../pages/products/AllProducts'));
const MainOrders = lazy(() => import('../pages/orders/MainOrders'));
const MyOrders = lazy(() => import('../pages/orders/MyOrders'));
const TakenOrders = lazy(() => import('../pages/orders/TakenOrders'));
const PlacedOrders = lazy(() => import('../pages/orders/PlacedOrders'));
const AllOrders = lazy(() => import('../pages/orders/AllOrders'));
const MainDeliveries = lazy(() => import('../pages/deliveries/MainDeliveries'));
const MyDeliveries = lazy(() => import('../pages/deliveries/MyDeliveries'));
const TakenDeliveries = lazy(
  () => import('../pages/deliveries/TakenDeliveries'),
);
const PlacedDeliveries = lazy(
  () => import('../pages/deliveries/PlacedDeliveries'),
);
const AllDeliveries = lazy(() => import('../pages/deliveries/AllDeliveries'));
const MyTrades = lazy(() => import('../pages/trades/MyTrades'));
const PlacedTrades = lazy(() => import('../pages/trades/PlacedTrades'));
const AllTrades = lazy(() => import('../pages/trades/AllTrades'));
const MySales = lazy(() => import('../pages/sales/MySales'));
const PlacedSales = lazy(() => import('../pages/sales/PlacedSales'));
const AllSales = lazy(() => import('../pages/sales/AllSales'));
const MainPolls = lazy(() => import('../pages/polls/MainPolls'));
const MyPolls = lazy(() => import('../pages/polls/MyPolls'));
const AllPolls = lazy(() => import('../pages/polls/AllPolls'));
const MyVotes = lazy(() => import('../pages/votes/MyVotes'));
const PolledVotes = lazy(() => import('../pages/votes/PolledVotes'));
const AllVotes = lazy(() => import('../pages/votes/AllVotes'));
const MainFriends = lazy(() => import('../pages/friends/MainFriends'));
const MyFriends = lazy(() => import('../pages/friends/MyFriends'));
const AllFriends = lazy(() => import('../pages/friends/AllFriends'));
import { Role } from '../common/constants';

export const pages = [
  { index: true, element: Home },
  { path: 'map', element: Map },
  {
    path: 'users',
    nested: [
      { index: true, element: MainUsers },
      { path: 'my', element: MyUsers },
      { path: 'all', element: AllUsers, role: Role.ADMIN },
      { path: ':userId', element: SingleUser },
    ],
  },
  {
    path: 'cards',
    nested: [
      { path: 'my', element: MyCards },
      { path: 'all', element: AllCards, role: Role.BANKER },
    ],
  },
  {
    path: 'exchanges',
    nested: [
      { path: 'my', element: MyExchanges },
      { path: 'all', element: AllExchanges, role: Role.BANKER },
    ],
  },
  {
    path: 'payments',
    nested: [
      { path: 'my', element: MyPayments },
      { path: 'all', element: AllPayments, role: Role.BANKER },
    ],
  },
  {
    path: 'invoices',
    nested: [
      { path: 'my', element: MyInvoices },
      { path: 'all', element: AllInvoices, role: Role.BANKER },
    ],
  },
  {
    path: 'cities',
    nested: [
      { index: true, element: MainCities },
      { path: 'my', element: MyCities },
      { path: 'all', element: AllCities, role: Role.ADMIN },
    ],
  },
  {
    path: 'shops',
    nested: [
      { index: true, element: MainShops },
      { path: 'my', element: MyShops },
      { path: 'all', element: AllShops, role: Role.MANAGER },
    ],
  },
  {
    path: 'markets',
    nested: [
      { index: true, element: MainMarkets },
      { path: 'my', element: MyMarkets },
      { path: 'all', element: AllMarkets, role: Role.MANAGER },
    ],
  },
  {
    path: 'storages',
    nested: [
      { index: true, element: MainStorages },
      { path: 'my', element: MyStorages },
      { path: 'all', element: AllStorages, role: Role.MANAGER },
    ],
  },
  {
    path: 'stores',
    nested: [
      { index: true, element: MainStores },
      { path: 'my', element: MyStores },
      { path: 'all', element: AllStores, role: Role.MANAGER },
    ],
  },
  {
    path: 'cells',
    nested: [
      { index: true, element: MainCells },
      { path: 'my', element: MyCells },
      { path: 'all', element: AllCells, role: Role.MANAGER },
    ],
  },
  {
    path: 'rents',
    nested: [
      { path: 'my', element: MyRents },
      { path: 'all', element: AllRents, role: Role.MANAGER },
    ],
  },
  {
    path: 'leases',
    nested: [
      { path: 'my', element: MyLeases },
      { path: 'all', element: AllLeases, role: Role.MANAGER },
    ],
  },
  {
    path: 'goods',
    nested: [
      { index: true, element: MainGoods },
      { path: 'my', element: MyGoods },
      { path: 'all', element: AllGoods, role: Role.MANAGER },
    ],
  },
  {
    path: 'wares',
    nested: [
      { index: true, element: MainWares },
      { path: 'my', element: MyWares },
      { path: 'placed', element: PlacedWares },
      { path: 'all', element: AllWares, role: Role.MANAGER },
    ],
  },
  {
    path: 'products',
    nested: [
      { index: true, element: MainProducts },
      { path: 'my', element: MyProducts },
      { path: 'placed', element: PlacedProducts },
      { path: 'all', element: AllProducts, role: Role.MANAGER },
    ],
  },
  {
    path: 'orders',
    nested: [
      { index: true, element: MainOrders },
      { path: 'my', element: MyOrders },
      { path: 'taken', element: TakenOrders },
      { path: 'placed', element: PlacedOrders },
      { path: 'all', element: AllOrders, role: Role.MANAGER },
    ],
  },
  {
    path: 'deliveries',
    nested: [
      { index: true, element: MainDeliveries },
      { path: 'my', element: MyDeliveries },
      { path: 'taken', element: TakenDeliveries },
      { path: 'placed', element: PlacedDeliveries },
      { path: 'all', element: AllDeliveries, role: Role.MANAGER },
    ],
  },
  {
    path: 'trades',
    nested: [
      { path: 'my', element: MyTrades },
      { path: 'placed', element: PlacedTrades },
      { path: 'all', element: AllTrades, role: Role.MANAGER },
    ],
  },
  {
    path: 'sales',
    nested: [
      { path: 'my', element: MySales },
      { path: 'placed', element: PlacedSales },
      { path: 'all', element: AllSales, role: Role.MANAGER },
    ],
  },
  {
    path: 'polls',
    nested: [
      { index: true, element: MainPolls },
      { path: 'my', element: MyPolls },
      { path: 'all', element: AllPolls, role: Role.ADMIN },
    ],
  },
  {
    path: 'votes',
    nested: [
      { path: 'my', element: MyVotes },
      { path: 'polled', element: PolledVotes },
      { path: 'all', element: AllVotes, role: Role.ADMIN },
    ],
  },
  {
    path: 'friends',
    nested: [
      { index: true, element: MainFriends },
      { path: 'my', element: MyFriends },
      { path: 'all', element: AllFriends, role: Role.ADMIN },
    ],
  },
  { path: '*', element: NotFound },
];
