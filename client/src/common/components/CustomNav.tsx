import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { pages, tabs } from '../../app/pages';
import { INav } from '../interfaces';
import { isUserNotHasRole } from '../utils';

type Props = INav;

export default function CustomNav(props: Props) {
  const [t] = useTranslation();

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
    </Group>
  );
}
