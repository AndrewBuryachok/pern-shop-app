import { useEffect } from 'react';
import { Button, Group, Menu, Paper, Stack } from '@mantine/core';
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
    await likeReport({
      ...dto,
      upLiked: !!report.upLiked,
      downLiked: !!report.downLiked,
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
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
                <Button
                  leftIcon={<IconThumbUp size={16} />}
                  variant={report.upLiked ? 'filled' : 'light'}
                  color={report.upLiked ? 'violet' : 'gray'}
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
              </Menu.Target>
              <Menu.Dropdown>
                <ViewReportLikesMenu data={report} type={true} />
              </Menu.Dropdown>
            </Menu>
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
                <Button
                  leftIcon={<IconThumbDown size={16} />}
                  variant={report.downLiked ? 'filled' : 'light'}
                  color={report.downLiked ? 'violet' : 'gray'}
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
              </Menu.Target>
              <Menu.Dropdown>
                <ViewReportLikesMenu data={report} type={false} />
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Menu
            zIndex={100}
            offset={4}
            position='top-end'
            trigger='hover'
            withArrow
          >
            <Menu.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color='gray'
                loading={props.isViewedLoading}
                compact
              >
                {report.views}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <ViewReportViewsMenu data={report} />
            </Menu.Dropdown>
          </Menu>
        </Group>
        <ViewReportCommentsModal data={report} />
      </Stack>
    </Paper>
  );
}
