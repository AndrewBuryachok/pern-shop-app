import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Card, SmCard, SmCardWithBalance } from './card.model';
import {
  CreateCardDto,
  EditCardDto,
  ExtCreateCardDto,
  UpdateCardUserDto,
} from './card.dto';
import { getQuery } from '../../common/utils';

export const cardsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyCards: build.query<IResponse<Card>, IRequest>({
      query: (req) => ({
        url: `/cards/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Card'],
    }),
    getAllCards: build.query<IResponse<Card>, IRequest>({
      query: (req) => ({
        url: `/cards/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Card'],
    }),
    selectMyCards: build.query<SmCardWithBalance[], void>({
      query: () => ({
        url: '/cards/my/select',
      }),
      providesTags: ['Auth', 'Card'],
    }),
    selectUserCards: build.query<SmCard[], number>({
      query: (userId) => ({
        url: `/cards/${userId}/select`,
      }),
      providesTags: ['Card'],
    }),
    selectUserCardsWithBalance: build.query<SmCardWithBalance[], number>({
      query: (userId) => ({
        url: `/cards/${userId}/ext-select`,
      }),
      providesTags: ['Card'],
    }),
    createMyCard: build.mutation<void, CreateCardDto>({
      query: (dto) => ({
        url: '/cards',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Card'],
    }),
    createUserCard: build.mutation<void, ExtCreateCardDto>({
      query: (dto) => ({
        url: '/cards/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Card'],
    }),
    editCard: build.mutation<void, EditCardDto>({
      query: ({ cardId, ...dto }) => ({
        url: `/cards/${cardId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Card'],
    }),
    addCardUser: build.mutation<void, UpdateCardUserDto>({
      query: ({ cardId, ...dto }) => ({
        url: `/cards/${cardId}/users`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Card'],
    }),
    removeCardUser: build.mutation<void, UpdateCardUserDto>({
      query: ({ cardId, ...dto }) => ({
        url: `/cards/${cardId}/users`,
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: ['Card'],
    }),
  }),
});

export const {
  useGetMyCardsQuery,
  useGetAllCardsQuery,
  useSelectMyCardsQuery,
  useSelectUserCardsQuery,
  useSelectUserCardsWithBalanceQuery,
  useCreateMyCardMutation,
  useCreateUserCardMutation,
  useEditCardMutation,
  useAddCardUserMutation,
  useRemoveCardUserMutation,
} = cardsApi;
