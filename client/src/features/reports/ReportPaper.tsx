import { useEffect } from 'react';
import { Button, Group, HoverCard, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconEye, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Report } from './report.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useLikeReportMutation, useViewReportMutation } from './reports.api';
import { LikeReportDto, ViewReportDto } from './report.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomActions from '../../common/components/CustomActions';
import ViewReportViewsMenu from './ViewReportViewsMenu';
import ViewReportLikesMenu from './ViewReportLikesMenu';
import ViewReportCommentsModal from './ViewReportCommentsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewReportAction } from './ViewReportModal';
import { openViewReportViewsModal } from './ViewReportViewsModal';

type Props = {
  report: Report & {
    viewed: boolean;
    upLiked: boolean;
    downLiked: boolean;
  };
  isViewedLoading: boolean;
  isLikedLoading: boolean;
  actions: IAction<Report>[];
};

export default function ReportPaper({ report, ...props }: Props) {
  const user = getCurrentUser();

  const [viewReport] = useViewReportMutation();

  const handleViewSubmit = async (dto: ViewReportDto) => {
    await viewReport(dto);
  };

  const [likeReport] = useLikeReportMutation();

  const handleLikeSubmit = async (dto: LikeReportDto) => {
    await likeReport(dto);
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
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbUp size={16} />}
                  variant='light'
                  color={report.upLiked ? 'green' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({
                          reportId: report.id,
                          type: true,
                        })
                      : openAuthModal()
                  }
                  compact
                >
                  {report.upLikes}
                </Button>
              </HoverCard.Target>
              {!!report.upLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewReportLikesMenu data={report} type={true} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
            <HoverCard zIndex={100} offset={4} position='top-start' withArrow>
              <HoverCard.Target>
                <Button
                  leftIcon={<IconThumbDown size={16} />}
                  variant='light'
                  color={report.downLiked ? 'red' : 'gray'}
                  loading={props.isLikedLoading}
                  onClick={() =>
                    user
                      ? handleLikeSubmit({
                          reportId: report.id,
                          type: false,
                        })
                      : openAuthModal()
                  }
                  compact
                >
                  {report.downLikes}
                </Button>
              </HoverCard.Target>
              {!!report.downLikes && (
                <HoverCard.Dropdown p={4}>
                  <ViewReportLikesMenu data={report} type={false} />
                </HoverCard.Dropdown>
              )}
            </HoverCard>
          </Group>
          <HoverCard zIndex={100} offset={4} position='top-end' withArrow>
            <HoverCard.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color={report.viewed ? 'blue' : 'gray'}
                loading={props.isViewedLoading}
                onClick={() => openViewReportViewsModal(report)}
                compact
              >
                {report.views}
              </Button>
            </HoverCard.Target>
            {!!report.views && (
              <HoverCard.Dropdown p={4}>
                <ViewReportViewsMenu data={report} />
              </HoverCard.Dropdown>
            )}
          </HoverCard>
        </Group>
        <ViewReportCommentsModal data={report} />
      </Stack>
    </Paper>
  );
}
