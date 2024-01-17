import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Task } from './task.model';
import { CreateTaskDto, ExtCreateTaskDto, TaskIdDto } from './task.dto';
import { getQuery } from '../../common/utils';

export const tasksApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainTasks: build.query<IResponse<Task>, IRequest>({
      query: (req) => ({
        url: `/tasks?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Task'],
    }),
    getMyTasks: build.query<IResponse<Task>, IRequest>({
      query: (req) => ({
        url: `/tasks/my?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Task'],
    }),
    getTakenTasks: build.query<IResponse<Task>, IRequest>({
      query: (req) => ({
        url: `/tasks/taken?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Task'],
    }),
    getAllTasks: build.query<IResponse<Task>, IRequest>({
      query: (req) => ({
        url: `/tasks/all?${getQuery(req)}`,
      }),
      providesTags: ['Auth', 'Task'],
    }),
    createMyTask: build.mutation<void, CreateTaskDto>({
      query: (dto) => ({
        url: '/tasks',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task'],
    }),
    createUserTask: build.mutation<void, ExtCreateTaskDto>({
      query: (dto) => ({
        url: '/tasks/all',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task'],
    }),
    takeTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId, ...dto }) => ({
        url: `/tasks/${taskId}/take`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task'],
    }),
    untakeTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}/take`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    executeTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),
    completeTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetMainTasksQuery,
  useGetMyTasksQuery,
  useGetTakenTasksQuery,
  useGetAllTasksQuery,
  useCreateMyTaskMutation,
  useCreateUserTaskMutation,
  useTakeTaskMutation,
  useUntakeTaskMutation,
  useExecuteTaskMutation,
  useCompleteTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
