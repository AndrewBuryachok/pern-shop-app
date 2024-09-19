import { emptyApi } from '../../app/empty.api';
import { Message, SmMessage } from './message.model';
import {
  CreateMessageDto,
  DeleteMessageDto,
  EditMessageDto,
} from './message.dto';

export const messagesApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    selectMyMessages: build.query<SmMessage[], void>({
      query: () => ({
        url: '/messages/my',
      }),
      providesTags: ['Auth'],
    }),
    selectUserMessages: build.query<Message[], number>({
      query: (userId) => ({
        url: `/messages/${userId}`,
      }),
      providesTags: ['Auth'],
    }),
    createMessage: build.mutation<void, CreateMessageDto>({
      query: (dto) => ({
        url: '/messages',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Message'],
    }),
    editMessage: build.mutation<void, EditMessageDto>({
      query: ({ messageId, ...dto }) => ({
        url: `/messages/${messageId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Message'],
    }),
    deleteMessage: build.mutation<void, DeleteMessageDto>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useSelectMyMessagesQuery,
  useSelectUserMessagesQuery,
  useCreateMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
