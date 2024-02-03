import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { pages, tabs } from '../../app/pages';
import { INav } from '../interfaces';
import { getCurrentUser } from '../../features/auth/auth.slice';
import {
  useAddMyRankMutation,
  useGetMyRanksQuery,
} from '../../features/users/users.api';
import { RankUserDto } from '../../features/users/user.dto';
import { isUserNotHasRole } from '../utils';

type Props = INav;

export default function CustomNav(props: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const notHasRole = isUserNotHasRole(props.button?.role);

  const active = useLocation().pathname.split('/');

  const tab = active[2] || 'main';

  const color = {
    server: 'red',
    site: 'yellow',
    status: 'blue',
    spawn: 'teal',
    hub: 'pink',
    end: 'violet',
  }[tab];

  const links = pages
    .find((page) => page.path === active[1])!
    .nested!.map(({ index, ...route }) => ({
      ...route,
      path: index ? 'main' : route.path,
    }));

  const { data, ...ranksResponse } = useGetMyRanksQuery(undefined, {
    skip: active[1] !== 'ranks' || !user,
  });

  const ranks = [
    {
      label: 'TMonitoring',
      value: data?.rank1,
      link: 'https://tmonitoring.com/server/minesquare',
    },
    {
      label: 'MinecraftInside',
      value: data?.rank2,
      link: 'https://minecraft-inside.ru/top/server/17890/vote',
    },
    {
      label: 'HotMc',
      value: data?.rank3,
      link: 'https://hotmc.ru/vote-200633',
    },
    {
      label: 'MinecraftRating',
      value: data?.rank4,
      link: 'https://minecraftrating.ru/vote/93158',
    },
  ];

  const [addRank] = useAddMyRankMutation();

  const handleSubmit = async (dto: RankUserDto) => {
    await addRank(dto);
  };

  return (
    <Group spacing={8}>
      {links.map((link) => (
        <Button
          key={link.path}
          component={Link}
          to={`/${active[1]}/${link.path}`.replace('/main', '')}
          color={link.path === tab ? color || 'pink' : 'gray'}
          disabled={
            link.path !== 'main' &&
            !tabs.includes(link.path!) &&
            isUserNotHasRole(link.role)
          }
          compact
        >
          {t(`pages.${link.path}`)}
        </Button>
      ))}
      {props.button && (
        <Button
          key={props.button.label}
          onClick={props.button.open}
          leftIcon={<IconPlus size={16} />}
          color='green'
          disabled={notHasRole}
          compact
        >
          {t(`actions.${props.button.label}`)}
        </Button>
      )}
      {active[1] === 'ranks' &&
        ranks.map((rank, index) => (
          <Button
            key={rank.label}
            component='a'
            href={rank.link}
            target='_blank'
            onClick={() => user && handleSubmit({ rank: index + 1 })}
            leftIcon={<IconPlus size={16} />}
            color='green'
            loading={ranksResponse.isFetching}
            loaderPosition='center'
            disabled={rank.value}
            compact
          >
            {rank.label}
          </Button>
        ))}
    </Group>
  );
}
