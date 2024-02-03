import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './base.query';

export const emptyApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Auth',
    'User',
    'Message',
    'Friend',
    'Subscriber',
    'Ignorer',
    'Report',
    'ReportView',
    'Attitude',
    'Annotation',
    'Article',
    'ArticleView',
    'Like',
    'Comment',
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
    'Task',
    'Plaint',
    'Answer',
    'Poll',
    'PollView',
    'Vote',
    'Discussion',
    'Rating',
    'Rank',
  ],
  endpoints: () => ({}),
});
