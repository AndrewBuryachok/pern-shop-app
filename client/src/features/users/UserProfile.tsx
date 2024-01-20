import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconBrandDiscord,
  IconBuildingSkyscraper,
  IconClock,
  IconHourglass,
  IconPencil,
} from '@tabler/icons';
import { ExtUser } from './user.model';
import ProfileAvatar from '../../common/components/ProfileAvatar';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import RolesBadge from '../../common/components/RolesBadge';
import CustomRating from '../../common/components/CustomRating';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import { editUserProfileAction } from './EditUserProfileModal';
import { openViewUserFriendsModal } from './ViewUserFriendsModal';
import { openViewUserSubscribersModal } from './ViewUserSubscribersModal';
import { openViewUserRatersModal } from './ViewUserRatersModal';
import { colors } from '../../common/constants';

type Props = {
  data: ExtUser;
};

export default function UserProfile({ data: user }: Props) {
  const [t] = useTranslation();

  const socials = [
    { label: 'friends', users: user.friends, open: openViewUserFriendsModal },
    {
      label: 'subscribers',
      users: user.subscribers,
      open: openViewUserSubscribersModal,
    },
    { label: 'raters', users: user.raters, open: openViewUserRatersModal },
  ];

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
          {socials.map((social) => (
            <Paper key={social.label} p={8}>
              <Group spacing={0} position='apart'>
                <Text size='sm' weight='bold'>
                  {t(`columns.${social.label}`)} ({social.users.length})
                </Text>
                <CustomAnchor
                  text={t('actions.view').toLowerCase()}
                  onClick={() => social.open(user)}
                />
              </Group>
              <Group spacing={8}>
                {social.users.slice(0, 6).map((user) => (
                  <Tooltip key={user.id} label={user.nick} withArrow>
                    <div>
                      <LinkedAvatar {...user} />
                    </div>
                  </Tooltip>
                ))}
                {!social.users.length && <SingleText text='-' />}
              </Group>
            </Paper>
          ))}
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
                  {t('columns.rating')}
                </Text>
                <CustomRating value={user.rating} />
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
              <div>
                <Text size='sm' weight='bold'>
                  {t('columns.online')}
                </Text>
                <Group spacing={8}>
                  <IconHourglass size={32} />
                  <div>
                    <DateText date={user.onlineAt} />
                  </div>
                </Group>
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
                    {t(`navbar.${stat.label}`)}
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
