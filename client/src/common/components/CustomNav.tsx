import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { pages } from '../../app/pages';
import { INav } from '../interfaces';
import { isUserNotHasRole } from '../utils';

type Props = INav;

export default function CustomNav(props: Props) {
  const [t] = useTranslation();

  const notHasRole = isUserNotHasRole(props.button?.role);

  const active = useLocation().pathname.split('/');

  const tab = active[2] || 'main';

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
          color={link.path === tab ? undefined : 'gray'}
          disabled={
            link.path !== 'main' &&
            link.path !== 'top' &&
            isUserNotHasRole(link.role)
          }
          compact
        >
          {t(`pages.${link.path}`)}
        </Button>
      ))}
      {props.button && (
        <Button
          leftIcon={<IconPlus size={16} />}
          color='green'
          onClick={props.button.open}
          disabled={notHasRole}
          compact
        >
          {t(`actions.${props.button.label}`)}
        </Button>
      )}
    </Group>
  );
}
