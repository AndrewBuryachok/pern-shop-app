import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { IconExternalLink, IconPlus } from '@tabler/icons';
import { INav } from '../interfaces';

type Props = INav;

export default function CustomNav(props: Props) {
  return (
    <Group spacing={8}>
      {props.links.map((link) => (
        <Button
          key={link.label}
          component={Link}
          to={link.to}
          leftIcon={<IconExternalLink size={14} />}
          disabled={link.disabled}
          compact
        >
          {link.label}
        </Button>
      ))}
      {props.button && (
        <Button
          key={props.button.label}
          onClick={props.button.open}
          leftIcon={<IconPlus size={14} />}
          color='green'
          compact
        >
          {props.button.label}
        </Button>
      )}
    </Group>
  );
}