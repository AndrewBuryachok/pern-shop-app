import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './base.query';

export const emptyApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Auth',
    'User',
    'Card',
    'Exchange',
    'Payment',
    'Invoice',
    'City',
    'Shop',
    'Market',
    'Storage',
    'Store',
    'Cell',
    'Rent',
    'Lease',
    'Good',
    'Ware',
    'Product',
    'Lot',
    'Order',
    'Delivery',
    'Trade',
    'Sale',
    'Bid',
    'Poll',
    'Vote',
    'Friend',
    'Following',
    'Rating',
    'Task',
    'Plaint',
    'Article',
    'Like',
  ],
  endpoints: () => ({}),
});
