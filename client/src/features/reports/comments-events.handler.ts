import { store } from '../../app/store';
import { ReportComment } from './comment.model';
import { commentsApi } from './comments.api';
import { reportsApi } from './reports.api';

export const handleReportCommentEvent = (id: number, json: string) => {
  const body = JSON.parse(json) as ReportComment;
  store.dispatch(
    commentsApi.util.updateQueryData('selectReportComments', id, (draft) => {
      const comment = draft.find((comment) => comment.id === body.id);
      if (!comment) {
        if (body.createdAt) {
          draft.push(body);
        }
      } else if (body.text) {
        comment.text = body.text;
      } else {
        return draft.filter((comment) => comment.id !== body.id);
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
                report.comment = body;
                report.comments++;
              } else if (body.text) {
                if (report.comment?.id === body.id) {
                  report.comment.text = body.text;
                }
              } else {
                if (report.comment?.id === body.id) {
                  const comments =
                    commentsApi.endpoints.selectReportComments.select(id)(
                      store.getState(),
                    ).data;
                  if (comments) {
                    if (comments.length) {
                      report.comment = comments[comments.length - 1];
                    } else {
                      report.comment = undefined;
                    }
                  }
                }
                report.comments--;
              }
            }
          },
        ),
      );
    });
};
