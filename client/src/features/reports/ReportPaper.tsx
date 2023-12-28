import { useEffect } from 'react';
import { ActionIcon, Group, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import {
  IconEye,
  IconMessage,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Report, SmReport } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useAttitudeReportMutation,
  useViewReportMutation,
} from './reports.api';
import { AttitudeReportDto, ViewReportDto } from './report.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
import { viewReportAction } from './ViewReportModal';
import { openViewReportViewsModal } from './ViewReportViewsModal';
import { openViewReportAttitudesModal } from './ViewReportAttitudesModal';
import { openViewReportAnnotationsModal } from './ViewReportAnnotationsModal';

type Props = {
  report: Report & {
    viewed: boolean;
    upAttituded?: SmReport;
    downAttituded?: SmReport;
  };
  isViewedLoading: boolean;
  isAttitutedLoading: boolean;
  actions: IAction<Report>[];
};

export default function ReportPaper({ report, ...props }: Props) {
  const user = getCurrentUser();

  const [viewReport] = useViewReportMutation();

  const handleViewSubmit = async (dto: ViewReportDto) => {
    await viewReport(dto);
  };

  const [attitudeReport] = useAttitudeReportMutation();

  const handleAttitudeSubmit = async (dto: AttitudeReportDto) => {
    await attitudeReport(dto);
  };

  const { ref, entry } = useIntersection();

  useEffect(() => {
    if (user && !report.viewed && entry?.isIntersecting) {
      handleViewSubmit({ reportId: report.id });
    }
  }, [entry?.isIntersecting]);

  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <AvatarWithDateText {...report} />
          <CustomActions
            data={report}
            actions={[viewReportAction, ...props.actions]}
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
            color={report.upAttituded && 'pink'}
            loading={props.isAttitutedLoading}
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
            color={report.downAttituded && 'pink'}
            loading={props.isAttitutedLoading}
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
              user ? openViewReportAnnotationsModal(report) : openAuthModal()
            }
          >
            <IconMessage size={16} />
          </ActionIcon>
          <CustomAnchor
            text={`${report.annotations}`}
            open={() => openViewReportAnnotationsModal(report)}
          />
          <ActionIcon
            ref={ref}
            size={24}
            loading={props.isViewedLoading}
            onClick={() => openViewReportViewsModal(report)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <CustomAnchor
            text={`${report.views}`}
            open={() => openViewReportViewsModal(report)}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
