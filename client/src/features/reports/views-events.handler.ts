import { store } from '../../app/store';
import { ReportView } from './report-view.model';
import { reportsApi } from './reports.api';

export const handleReportViewEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as ReportView;
  store.dispatch(
    reportsApi.util.updateQueryData('selectReportViews', id, (draft) => {
      const view = draft.find((view) => view.id === body.id);
      if (!view) {
        draft.unshift(body);
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
              report.views++;
            }
          },
        ),
      );
    });
};
