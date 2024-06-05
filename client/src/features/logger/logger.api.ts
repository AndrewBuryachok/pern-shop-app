import { emptyApi } from '../../app/empty.api';
import { Log } from './log.model';

export const loggerApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getLogs: build.query<Log[], void>({
      query: () => ({ url: '/logs/ip?take=336' }),
    }),
  }),
});

export const { useGetLogsQuery } = loggerApi;
