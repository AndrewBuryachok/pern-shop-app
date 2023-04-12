import { ActionIcon, Group } from '@mantine/core';
import { IconDots, IconMinus, IconPencil, IconPlus } from '@tabler/icons';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { IAction, IModal } from '../interfaces';
import { Color, colors } from '../constants';

type Props<T> = IModal<T> & {
  actions: IAction<T>[];
};

export default function CustomActions<T>(props: Props<T>) {
  const user = getCurrentUser();

  const icons = [
    <IconMinus size={16} />,
    <IconPencil size={16} />,
    <IconPlus size={16} />,
    <IconDots size={16} />,
  ];

  return (
    <Group spacing={4}>
      {props.actions
        .filter((action) => user || action.color === Color.BLUE)
        .map((action) => (
          <ActionIcon
            key={action.color}
            size={24}
            variant='filled'
            color={colors[action.color - 1]}
            onClick={() => action.open(props.data)}
            disabled={action.disable(props.data)}
          >
            {icons[action.color - 1]}
          </ActionIcon>
        ))}
    </Group>
  );
}
