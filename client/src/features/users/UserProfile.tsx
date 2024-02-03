import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Container,
  CopyButton,
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
  IconBrandTwitch,
  IconBrandYoutube,
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

  const contacts = [
    {
      icon: IconBrandTwitch,
      label: user.twitch,
      href: `https://twitch.tv/${user.twitch}`,
    },
    {
      icon: IconBrandYoutube,
      label: user.youtube,
      href: `https://youtube.com/@${user.youtube}`,
    },
  ];

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
    { label: 'articles', count: user.articles },
    { label: 'likes', count: user.likes },
    { label: 'comments', count: user.comments },
    { label: 'tasks', count: user.tasks },
    { label: 'plaints', count: user.plaints },
    { label: 'polls', count: user.polls },
    { label: 'votes', count: user.votes },
    { label: 'discussions', count: user.discussions },
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
                  open={() => social.open(user)}
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
          <Paper p={8}>
            <Text size='sm' weight='bold'>
              {t('columns.contacts')}
            </Text>
            <Stack spacing={8}>
              {user.discord && (
                <CopyButton value={user.discord}>
                  {({ copy }) => (
                    <Button
                      leftIcon={<IconBrandDiscord size={16} />}
                      onClick={copy}
                      variant='light'
                      color='gray'
                      compact
                    >
                      {user.discord}
                    </Button>
                  )}
                </CopyButton>
              )}
              {contacts.map(
                (contact, index) =>
                  contact.label && (
                    <Button
                      key={index}
                      leftIcon={<contact.icon size={16} />}
                      component='a'
                      href={contact.href}
                      target='_blank'
                      variant='light'
                      color='gray'
                      compact
                    >
                      {contact.label}
                    </Button>
                  ),
              )}
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
                  {t('columns.time')}
                </Text>
                <SingleText text={`${Math.floor(user.time / 6) / 10}`} />
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
                  <Text size='sm' color={colors[index % 4]}>
                    {t(`navbar.${stat.label}`)}
                  </Text>
                  <Text size='lg' weight='bold'>
                    {stat.count || 0}
                  </Text>
                  {stat.rate !== undefined && (
                    <CustomRating value={stat.rate} />
                  )}
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Flex>
    </Container>
  );
}
