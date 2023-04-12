import { Avatar, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBuildingSkyscraper } from '@tabler/icons';
import { ExtUser } from './user.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomIndicator from '../../common/components/CustomIndicator';
import RolesBadge from '../../common/components/RolesBadge';
import CustomActions from '../../common/components/CustomActions';
import FriendChip from '../../common/components/FriendChip';
import { viewUserFriendsAction } from './ViewUserFriendsModal';
import CustomRating from '../../common/components/CustomRating';
import { createRatingAction } from '../ratings/CreateRatingModal';
import PlaceText from '../../common/components/PlaceText';
import { colors } from '../../common/constants';

type Props = {
  data: ExtUser;
};

export default function UserProfile({ data: user }: Props) {
  const me = getCurrentUser();

  const stats = [
    { label: 'Goods', value: user.goods, color: 'red' },
    { label: 'Wares', value: user.wares, color: 'yellow' },
    { label: 'Products', value: user.products, color: 'green' },
    { label: 'Trades', value: user.trades, color: 'blue' },
    { label: 'Sales', value: user.sales, color: 'violet' },
  ];

  return (
    <Stack align='center'>
      <CustomIndicator status={user.status}>
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
        <FriendChip data={user} />
        <CustomActions data={user} actions={[viewUserFriendsAction]} />
      </Group>
      <Group spacing={me ? 8 : 0}>
        <CustomRating value={user.rating} />
        <CustomActions data={user} actions={[createRatingAction]} />
      </Group>
      {user.city && (
        <Group spacing={8}>
          <IconBuildingSkyscraper size={32} />
          <div>
            <PlaceText {...user.city} />
          </div>
        </Group>
      )}
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
              {stat.label}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
