import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Card, SmCard, SmCardWithBalance } from './card.model';
import { CreateCardDto, EditCardDto } from './card.dto';
import { getQuery } from '../../common/utils';

export const cardsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMyCards: build.query<IResponse<Card>, IRequest>({
      query: (req) => ({
        url: `/cards/my?${getQuery(req)}`,
      }),
      providesTags: ['Card'],
    }),
    getAllCards: build.query<IResponse<Card>, IRequest>({
      query: (req) => ({
        url: `/cards/all?${getQuery(req)}`,
      }),
      providesTags: ['Card'],
    }),
    selectMyCards: build.query<SmCardWithBalance[], void>({
      query: () => ({
        url: '/cards/my/select',
      }),
      providesTags: ['Card'],
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
    createCard: build.mutation<void, CreateCardDto>({
      query: (dto) => ({
        url: '/cards',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Card', 'User'],
    }),
    editCard: build.mutation<void, EditCardDto>({
      query: ({ cardId, ...dto }) => ({
        url: `/cards/${cardId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Card', 'User'],
    }),
  }),
});

export const {
  useGetMyCardsQuery,
  useGetAllCardsQuery,
  useSelectMyCardsQuery,
  useSelectUserCardsQuery,
  useSelectUserCardsWithBalanceQuery,
  useCreateCardMutation,
  useEditCardMutation,
} = cardsApi;
