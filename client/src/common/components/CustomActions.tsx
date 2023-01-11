import { ActionIcon, Group } from '@mantine/core';
import { IconDots, IconMinus, IconPencil, IconPlus } from '@tabler/icons';
import { IAction, IModal } from '../interfaces';
import { colors } from '../constants';

type Props<T> = IModal<T> & {
  actions: IAction<T>[];
};

export default function CustomActions<T>(props: Props<T>) {
  const icons = [
    <IconMinus size={14} />,
    <IconPencil size={14} />,
    <IconPlus size={14} />,
    <IconDots size={14} />,
  ];

  return (
    <Group spacing={4}>
      {props.actions.map((action) => (
        <ActionIcon
          key={action.color}
          onClick={() => action.open(props.data)}
          size='sm'
          color={colors[action.color - 1]}
          variant='filled'
          disabled={action.disable(props.data)}
        >
          {icons[action.color - 1]}
        </ActionIcon>
      ))}
    </Group>
  );
}
