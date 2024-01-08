import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Anchor,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconBrandDiscord,
  IconBuildingSkyscraper,
  IconClock,
  IconPencil,
} from '@tabler/icons';
import { ExtUser } from './user.model';
import ProfileAvatar from '../../common/components/ProfileAvatar';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import CustomRating from '../../common/components/CustomRating';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import PlaceText from '../../common/components/PlaceText';
import { editUserProfileAction } from './EditUserProfileModal';
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
          <ProfileAvatar {...user} />
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
                    onClick={() => openViewUserFriendsModal(user)}
                    size='xs'
                    underline
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
              <div>
                <Group spacing={8}>
                  <Text size='xl' weight='bold'>
                    {user.nick}
                  </Text>
                  <ActionIcon
                    size={24}
                    variant='filled'
                    color='yellow'
                    onClick={() => editUserProfileAction.open(user)}
                    disabled={editUserProfileAction.disable(user)}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                </Group>
                {user.discord && (
                  <Group spacing={8}>
                    <IconBrandDiscord size={16} />
                    <Text size='sm'>{user.discord}</Text>
                  </Group>
                )}
              </div>
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
