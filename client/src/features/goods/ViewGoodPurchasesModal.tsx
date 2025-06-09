import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Good } from './good.model';
import { useSelectGoodPurchasesQuery } from './goods.api';
import { Button, Group, Skeleton, Stack, Timeline } from '@mantine/core';
import SingleText from '../../common/components/SingleText';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parsePurchaseAmount, parseTime } from '../../common/utils';

type Props = IModal<Good>;

export default function ViewGoodPurchases({ data: good }: Props) {
  const {
    data: purchases,
    isFetching,
    refetch,
  } = useSelectGoodPurchasesQuery(good.id);

  return (
    <Stack spacing={8}>
      <Timeline bulletSize={32}>
        {isFetching
          ? [...Array(2).keys()].map((key) => (
              <Timeline.Item key={key} title={<Skeleton w={64} h={16} />}>
                <Skeleton w={128} h={16} />
              </Timeline.Item>
            ))
          : purchases?.map((purchase) => (
              <Timeline.Item
                key={purchase.id}
                title={
                  <Group spacing={8}>
                    <SingleText text={purchase.card.user.nick} bold />
                    <SingleText text={parseTime(purchase.createdAt)} dimmed />
                  </Group>
                }
                bullet={<CustomAvatar {...purchase.card.user} />}
              >
                <SingleText text={parsePurchaseAmount({ ...purchase, good })} />
              </Timeline.Item>
            ))}
      </Timeline>
      <Button onClick={refetch} disabled={isFetching}>
        {t('components.refetch')}
      </Button>
    </Stack>
  );
}

export const openViewGoodPurchasesModal = (good: Good) =>
  openModal({
    title: t('columns.purchases'),
    children: <ViewGoodPurchases data={good} />,
  });
