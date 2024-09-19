import { ITableWithActions } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectLikedReportsQuery,
  useSelectViewedReportsQuery,
} from './reports.api';
import CustomList from '../../common/components/CustomList';
import ReportPaper from './ReportPaper';

type Props = ITableWithActions<Report>;

export default function ReportsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: viewedReports, ...viewedReportsResponse } =
    useSelectViewedReportsQuery(undefined, { skip: !user });

  const { data: likedReports, ...likedReportsResponse } =
    useSelectLikedReportsQuery(undefined, { skip: !user });

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((report) => ({
          ...report,
          viewed: !!viewedReports?.includes(report.id),
          upLiked: !!likedReports?.up.includes(report.id),
          downLiked: !!likedReports?.down.includes(report.id),
        }))
        .map((report) => (
          <ReportPaper
            key={report.id}
            report={report}
            isViewedLoading={viewedReportsResponse.isFetching}
            isLikedLoading={likedReportsResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
