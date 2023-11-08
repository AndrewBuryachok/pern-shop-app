import { useTranslation } from 'react-i18next';
import { Avatar, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBuildingSkyscraper, IconClock } from '@tabler/icons';
import { ExtUser } from './user.model';
import CustomIndicator from '../../common/components/CustomIndicator';
import RolesBadge from '../../common/components/RolesBadge';
import DateText from '../../common/components/DateText';
import FriendChip from '../../common/components/FriendChip';
import CustomRating from '../../common/components/CustomRating';
import PlaceText from '../../common/components/PlaceText';
import { colors } from '../../common/constants';

type Props = {
  data: ExtUser;
};

export default function UserProfile({ data: user }: Props) {
  const [t] = useTranslation();

  const stats = [
    { label: 'wares', value: user.wares, color: 'red' },
    { label: 'products', value: user.products, color: 'yellow' },
    { label: 'orders', value: user.orders, color: 'green' },
    { label: 'deliveries', value: user.deliveries, color: 'blue' },
    { label: 'goods', value: user.goods, color: 'violet' },
  ];

  const rates = [
    { label: 'trades', value: user.tradesRate, color: 'red' },
    { label: 'sales', value: user.salesRate, color: 'yellow' },
    { label: 'orders', value: user.ordersRate, color: 'green' },
    { label: 'deliveries', value: user.deliveriesRate, color: 'blue' },
  ];

  return (
    <Stack align='center'>
      <CustomIndicator {...user}>
        <Avatar
          size={128}
          src={`${import.meta.env.VITE_AVATAR_URL}${
            import.meta.env.VITE_BUST_ROUTE
          }${user.name}`}
          alt={user.name}
        />
      </CustomIndicator>
      <Text size='xl' weight='bold'>
        {user.name}
      </Text>
      <RolesBadge roles={user.roles} />
      <Group spacing={8}>
        <IconClock size={32} />
        <div>
          <DateText date={user.registeredAt} />
        </div>
      </Group>
      {user.city && (
        <Group spacing={8}>
          <IconBuildingSkyscraper size={32} />
          <div>
            <PlaceText {...user.city} />
          </div>
        </Group>
      )}
      <FriendChip data={user} />
      <CustomRating value={user.rating} />
      {!!user.cards.length && (
        <Group spacing={8}>
          {user.cards.map((card) => (
            <Paper key={card.id} p={8} withBorder>
              <Text size='sm' color={colors[card.color - 1]}>
                {card.name}
              </Text>
            </Paper>
          ))}
        </Group>
      )}
      <SimpleGrid
        cols={5}
        spacing={8}
        breakpoints={[{ maxWidth: 'xs', cols: 3 }]}
      >
        {stats.map((stat) => (
          <Paper key={stat.label} p={8} withBorder>
            <Text align='center' size='lg' weight='bold'>
              {stat.value}
            </Text>
            <Text align='center' size='sm' color={stat.color}>
              {t('navbar.' + stat.label)}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
      <SimpleGrid
        cols={4}
        spacing={8}
        breakpoints={[{ maxWidth: 'xs', cols: 2 }]}
      >
        {rates.map((rate) => (
          <Paper key={rate.label} p={8} withBorder>
            <Text align='center' size='lg' weight='bold'>
              {rate.value.toFixed(1)}
            </Text>
            <Text align='center' size='sm' color={rate.color}>
              {t('navbar.' + rate.label)}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
