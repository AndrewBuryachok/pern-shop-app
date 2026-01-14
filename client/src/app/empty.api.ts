import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './base.query';

export const emptyApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Auth',
    'User',
    'Message',
    'Friend',
    'Article',
    'View',
    'Like',
    'Comment',
    'Card',
    'Exchange',
    'Transaction',
    'Invoice',
    'Town',
    'Resident',
    'Invitation',
    'Application',
    'Shop',
    'Station',
    'Good',
    'Purchase',
    'Delivery',
    'Order',
  ],
  endpoints: () => ({}),
});
