import { ITableWithActions } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectAttitudedReportsQuery,
  useSelectViewedReportsQuery,
} from './reports.api';
import CustomList from '../../common/components/CustomList';
import ReportPaper from './ReportPaper';

type Props = ITableWithActions<Report>;

export default function ReportsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: viewedReports, ...viewedReportsResponse } =
    useSelectViewedReportsQuery(undefined, { skip: !user });

  const { data: attitudedReports, ...attitudedReportsResponse } =
    useSelectAttitudedReportsQuery(undefined, { skip: !user });

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((report) => ({
          ...report,
          viewed: !!viewedReports?.includes(report.id),
          upAttituded: attitudedReports?.find(
            (attitudedReport) =>
              attitudedReport.id === report.id && attitudedReport.attitude.type,
          ),
          downAttituded: attitudedReports?.find(
            (attitudedReport) =>
              attitudedReport.id === report.id &&
              !attitudedReport.attitude.type,
          ),
        }))
        .map((report) => (
          <ReportPaper
            key={report.id}
            report={report}
            isViewedLoading={viewedReportsResponse.isFetching}
            isAttitutedLoading={attitudedReportsResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
