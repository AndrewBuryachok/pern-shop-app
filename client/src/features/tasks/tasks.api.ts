import { emptyApi } from '../../app/empty.api';
import { IRequest, IResponse } from '../../common/interfaces';
import { Task } from './task.model';
import {
  CreateTaskDto,
  EditTaskDto,
  TaskIdDto,
  TakeTaskDto,
  CompleteTaskDto,
} from './task.dto';
import { getQuery } from '../../common/utils';

export const tasksApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getMainTasks: build.query<IResponse<Task>, IRequest>({
      query: (req) => ({
        url: `/tasks?${getQuery(req)}`,
      }),
      providesTags: ['Task'],
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
    createTask: build.mutation<void, CreateTaskDto>({
      query: (dto) => ({
        url: '/tasks',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task', 'Hire', 'Box', 'Payment', 'Card'],
    }),
    editTask: build.mutation<void, EditTaskDto>({
      query: ({ taskId, ...dto }) => ({
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Task', 'Card'],
    }),
    takeTask: build.mutation<void, TakeTaskDto>({
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
    completeTask: build.mutation<void, CompleteTaskDto>({
      query: ({ taskId, ...dto }) => ({
        url: `/tasks/${taskId}`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Task', 'Payment', 'Card'],
    }),
    deleteTask: build.mutation<void, TaskIdDto>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task', 'Card'],
    }),
  }),
});

export const {
  useGetMainTasksQuery,
  useGetMyTasksQuery,
  useGetTakenTasksQuery,
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useTakeTaskMutation,
  useUntakeTaskMutation,
  useExecuteTaskMutation,
  useCompleteTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
