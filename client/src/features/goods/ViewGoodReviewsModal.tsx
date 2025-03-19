import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useSelectGoodReviewsQuery } from './goods.api';
import { Button, Group, Skeleton, Stack, Timeline } from '@mantine/core';
import SingleText from '../../common/components/SingleText';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomRating from '../../common/components/CustomRating';
import { parseTime } from '../../common/utils';

type Props = IModal<Good>;

export default function ViewGoodReviews({ data: good }: Props) {
  const {
    data: reviews,
    isFetching,
    refetch,
  } = useSelectGoodReviewsQuery(good.id);

  return (
    <Stack spacing={8}>
      <Timeline bulletSize={32}>
        {isFetching
          ? [...Array(2).keys()].map((key) => (
              <Timeline.Item key={key} title={<Skeleton w={64} h={16} />}>
                <Skeleton w={128} h={16} />
              </Timeline.Item>
            ))
          : reviews?.map((review) => (
              <Timeline.Item
                key={review.id}
                title={
                  <Group spacing={8}>
                    <SingleText text={review.card.user.nick} bold />
                    <SingleText text={parseTime(review.createdAt)} dimmed />
                  </Group>
                }
                bullet={<CustomAvatar {...review.card.user} />}
              >
                <CustomRating value={review.rate} />{' '}
              </Timeline.Item>
            ))}
      </Timeline>
      <Button onClick={refetch} disabled={isFetching}>
        {t('components.refetch')}
      </Button>
    </Stack>
  );
}

export const openViewGoodReviewsModal = (good: Good) =>
  openModal({
    title: t('columns.reviews'),
    children: <ViewGoodReviews data={good} />,
  });
