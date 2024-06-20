import { useEffect } from 'react';
import { Button, Group, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconEye, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Report } from './report.model';
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
import CustomActions from '../../common/components/CustomActions';
import ViewReportAnnotationsModal from './ViewReportAnnotationsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewReportAction } from './ViewReportModal';
import { openViewReportViewsModal } from './ViewReportViewsModal';

type Props = {
  report: Report & {
    viewed: boolean;
    upAttituded: boolean;
    downAttituded: boolean;
  };
  isViewedLoading: boolean;
  isAttitudedLoading: boolean;
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
    await attitudeReport({
      ...dto,
      upAttituded: !!report.upAttituded,
      downAttituded: !!report.downAttituded,
    });
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
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <Button
              leftIcon={<IconThumbUp size={16} />}
              variant={report.upAttituded ? 'filled' : 'light'}
              color={report.upAttituded ? 'violet' : 'gray'}
              loading={props.isAttitudedLoading}
              onClick={() =>
                user
                  ? handleAttitudeSubmit({ reportId: report.id, type: true })
                  : openAuthModal()
              }
              compact
            >
              {report.upAttitudes}
            </Button>
            <Button
              leftIcon={<IconThumbDown size={16} />}
              variant={report.downAttituded ? 'filled' : 'light'}
              color={report.downAttituded ? 'violet' : 'gray'}
              loading={props.isAttitudedLoading}
              onClick={() =>
                user
                  ? handleAttitudeSubmit({ reportId: report.id, type: false })
                  : openAuthModal()
              }
              compact
            >
              {report.downAttitudes}
            </Button>
          </Group>
          <Button
            ref={ref}
            leftIcon={<IconEye size={16} />}
            variant='light'
            color='gray'
            loading={props.isViewedLoading}
            onClick={() => openViewReportViewsModal(report)}
            compact
          >
            {report.views}
          </Button>
        </Group>
        <ViewReportAnnotationsModal data={report} />
      </Stack>
    </Paper>
  );
}
