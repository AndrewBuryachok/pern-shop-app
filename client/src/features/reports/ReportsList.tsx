import { ActionIcon, Group, Paper, Stack } from '@mantine/core';
import { IconMessage, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useAttitudeReportMutation,
  useSelectAttitudedReportsQuery,
} from './reports.api';
import { AttitudeReportDto } from './report.dto';
import CustomList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
import { viewReportAction } from './ViewReportModal';
import { openViewReportAttitudesModal } from './ViewReportAttitudesModal';
import { openViewReportAnnotationsModal } from './ViewReportAnnotationsModal';

type Props = ITableWithActions<Report>;

export default function ReportsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: attitudedReports, ...attitudedReportsResponse } =
    useSelectAttitudedReportsQuery(undefined, { skip: !user });

  const [attitudeReport] = useAttitudeReportMutation();

  const handleAttitudeSubmit = async (dto: AttitudeReportDto) => {
    await attitudeReport(dto);
  };

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((report) => ({
          ...report,
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
          <Paper key={report.id} p='md'>
            <Stack spacing={8}>
              <Group spacing={0} position='apart'>
                <AvatarWithDateText {...report} />
                <CustomActions
                  data={report}
                  actions={[viewReportAction, ...actions]}
                />
              </Group>
              <CustomHighlight text={report.text} />
              {report.image1 && <CustomImage image={report.image1} />}
              {report.image2 && <CustomImage image={report.image2} />}
              {report.image3 && <CustomImage image={report.image3} />}
              {report.video && <CustomVideo video={report.video} />}
              <Group spacing={8}>
                <ActionIcon
                  size={24}
                  variant={report.upAttituded && 'filled'}
                  color={report.upAttituded && 'violet'}
                  loading={attitudedReportsResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleAttitudeSubmit({
                          reportId: report.id,
                          type: true,
                        })
                      : openAuthModal()
                  }
                >
                  <IconThumbUp size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${report.upAttitudes}`}
                  open={() => openViewReportAttitudesModal(report)}
                />
                <ActionIcon
                  size={24}
                  variant={report.downAttituded && 'filled'}
                  color={report.downAttituded && 'violet'}
                  loading={attitudedReportsResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleAttitudeSubmit({
                          reportId: report.id,
                          type: false,
                        })
                      : openAuthModal()
                  }
                >
                  <IconThumbDown size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${report.downAttitudes}`}
                  open={() => openViewReportAttitudesModal(report)}
                />
                <ActionIcon
                  size={24}
                  onClick={() =>
                    user
                      ? openViewReportAnnotationsModal(report)
                      : openAuthModal()
                  }
                >
                  <IconMessage size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${report.annotations}`}
                  open={() => openViewReportAnnotationsModal(report)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}
    </CustomList>
  );
}
