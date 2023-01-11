import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './base.query';

export const emptyApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'User',
    'Card',
    'Exchange',
    'Payment',
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
    'Trade',
    'Sale',
    'Poll',
    'Vote',
  ],
  endpoints: () => ({}),
});
