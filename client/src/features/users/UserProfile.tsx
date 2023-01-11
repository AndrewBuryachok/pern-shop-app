import { Avatar, Group, Paper, Stack, Text } from '@mantine/core';
import { IconBuildingSkyscraper } from '@tabler/icons';
import { ExtUser } from './user.model';
import RolesBadge from '../../common/components/RolesBadge';
import PlaceText from '../../common/components/PlaceText';
import { colors } from '../../common/constants';

type Props = {
  data: ExtUser;
};

export default function UserProfile({ data: user }: Props) {
  const stats = [
    { label: 'Goods', value: user.goods },
    { label: 'Wares', value: user.wares },
    { label: 'Products', value: user.products },
    { label: 'Trades', value: user.trades },
    { label: 'Sales', value: user.sales },
  ];

  return (
    <Paper p='xl' withBorder>
      <Stack align='center' spacing={8}>
        <Avatar
          size={128}
          src={`https://minotar.net/bust/${user.name}/128.png`}
          alt={user.name}
        />
        <Text size='xl' weight='bold'>
          {user.name}
        </Text>
        <RolesBadge roles={user.roles} />
        {user.city && (
          <Group spacing={8}>
            <IconBuildingSkyscraper size={32} />
            <div>
              <PlaceText {...user.city} />
            </div>
          </Group>
        )}
        {!!user.cards.length && (
          <Group spacing={16}>
            {user.cards.map((card) => (
              <Paper key={card.id} p={8} withBorder>
                <Text size='sm' color={colors[card.color - 1]}>
                  {card.name}
                </Text>
              </Paper>
            ))}
          </Group>
        )}
        <Group spacing={32}>
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <Text align='center' size='lg' weight='bold'>
                {stat.value}
              </Text>
              <Text align='center' size='sm' color={colors[index]}>
                {stat.label}
              </Text>
            </div>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
}
