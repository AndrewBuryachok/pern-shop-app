import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Avatar,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconBuildingSkyscraper, IconClock } from '@tabler/icons';
import { ExtUser } from './user.model';
import CustomIndicator from '../../common/components/CustomIndicator';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import CustomRating from '../../common/components/CustomRating';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import PlaceText from '../../common/components/PlaceText';
import { openViewUserFriendsModal } from './ViewUserFriendsModal';
import { colors } from '../../common/constants';

type Props = {
  data: ExtUser;
};

export default function UserProfile({ data: user }: Props) {
  const [t] = useTranslation();

  const stats = [
    { label: 'wares', count: user.waresCount, rate: user.waresRate },
    { label: 'products', count: user.productsCount, rate: user.productsRate },
    { label: 'orders', count: user.ordersCount, rate: user.ordersRate },
    {
      label: 'deliveries',
      count: user.deliveriesCount,
      rate: user.deliveriesRate,
    },
  ];

  return (
    <Container px={0}>
      <Flex gap='md' justify='center' direction={{ base: 'column', xs: 'row' }}>
        <Stack spacing={8}>
          <Stack spacing={0} align='center'>
            <CustomIndicator {...user}>
              <Avatar
                px={8}
                pt={16}
                bg='violet'
                radius='md'
                size={248}
                src={`${import.meta.env.VITE_AVATAR_URL}${
                  import.meta.env.VITE_BUST_ROUTE
                }${user.nick}`}
                alt={user.nick}
              >
                {user.nick.toUpperCase().slice(0, 2)}
              </Avatar>
            </CustomIndicator>
          </Stack>
          <Paper p={8}>
            <Stack spacing={8}>
              <div>
                <Group spacing={0} position='apart'>
                  <Text size='sm' weight='bold'>
                    {t('columns.friends')}
                  </Text>
                  <Anchor
                    component='button'
                    type='button'
                    size='sm'
                    onClick={() => openViewUserFriendsModal(user)}
                  >
                    {t('actions.view').toLowerCase()}
                  </Anchor>
                </Group>
                <Group spacing={8}>
                  {user.friends.slice(0, 6).map((friend) => (
                    <LinkedAvatar key={friend.id} {...friend} />
                  ))}
                  {!user.friends.length && <SingleText text='-' />}
                </Group>
              </div>
              <div>
                <Text size='sm' weight='bold'>
                  {t('columns.rating')}
                </Text>
                <CustomRating value={user.rating} />
              </div>
            </Stack>
          </Paper>
        </Stack>
        <Stack spacing={8}>
          <Paper p={8}>
            <Stack spacing={8}>
              <Text size='xl' weight='bold'>
                {user.nick}
              </Text>
              <div>
                <Text size='sm' weight='bold'>
                  {t('columns.roles')}
                </Text>
                <RolesBadge roles={user.roles} />
              </div>
              <div>
                <Text size='sm' weight='bold'>
                  {t('columns.created')}
                </Text>
                <Group spacing={8}>
                  <IconClock size={32} />
                  <div>
                    <DateText date={user.createdAt} />
                  </div>
                </Group>
              </div>
              <div>
                <Text size='sm' weight='bold'>
                  {t('columns.city')}
                </Text>
                <Group spacing={8}>
                  <IconBuildingSkyscraper size={32} />
                  <div>
                    {user.city ? (
                      <PlaceText {...user.city} />
                    ) : (
                      <SingleText text='-' />
                    )}
                  </div>
                </Group>
              </div>
            </Stack>
          </Paper>
          <SimpleGrid
            cols={4}
            spacing={8}
            breakpoints={[{ maxWidth: 'md', cols: 2 }]}
          >
            {stats.map((stat, index) => (
              <Paper key={stat.label} p={8}>
                <Stack spacing={0} align='center'>
                  <Text size='sm' color={colors[index]}>
                    {t('navbar.' + stat.label)}
                  </Text>
                  <Text size='lg' weight='bold'>
                    {stat.count || 0}
                  </Text>
                  <CustomRating value={stat.rate} />
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Flex>
    </Container>
  );
}
