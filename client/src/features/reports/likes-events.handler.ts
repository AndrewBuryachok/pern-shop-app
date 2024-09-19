import { store } from '../../app/store';
import { ReportLike } from './report-like.model';
import { reportsApi } from './reports.api';

export const handleReportLikeEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as ReportLike & { toggle: boolean };
  store.dispatch(
    reportsApi.util.updateQueryData('selectReportLikes', id, (draft) => {
      const like = draft.find((like) => like.id === body.id);
      if (!like) {
        if (body.createdAt) {
          draft.unshift(body);
        }
      } else if (body.toggle) {
        like.type = !like.type;
      } else {
        return draft.filter((like) => like.id !== body.id);
      }
    }),
  );
  const endpoints = reportsApi.util.selectInvalidatedBy(store.getState(), [
    'Report',
  ]);
  endpoints
    .filter((endpoint) => endpoint.endpointName === 'getMainReports')
    .forEach((endpoint) => {
      store.dispatch(
        reportsApi.util.updateQueryData(
          'getMainReports',
          endpoint.originalArgs,
          (draft) => {
            const report = draft.result.find((report) => report.id === id);
            if (report) {
              if (body.createdAt) {
                if (body.type) {
                  report.upLikes++;
                } else {
                  report.downLikes++;
                }
              } else if (body.toggle) {
                if (body.type) {
                  report.upLikes++;
                  report.downLikes--;
                } else {
                  report.upLikes--;
                  report.downLikes++;
                }
              } else {
                if (body.type) {
                  report.upLikes--;
                } else {
                  report.downLikes--;
                }
              }
            }
          },
        ),
      );
    });
};
