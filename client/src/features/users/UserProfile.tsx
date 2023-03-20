import { Avatar, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBuildingSkyscraper } from '@tabler/icons';
import { ExtUser } from './user.model';
import CustomIndicator from '../../common/components/CustomIndicator';
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
    <Stack align='center' spacing={8}>
      <CustomIndicator status={user.status}>
        <Avatar
          size={128}
          src={`https://minotar.net/bust/${user.name}/128.png`}
          alt={user.name}
        />
      </CustomIndicator>
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
        <Group spacing={8}>
          {user.cards.map((card) => (
            <Paper key={card.id} p={4}>
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
        {stats.map((stat, index) => (
          <Paper key={stat.label} p={4}>
            <Text align='center' size='lg' weight='bold'>
              {stat.value}
            </Text>
            <Text align='center' size='sm' color={colors[index]}>
              {stat.label}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
