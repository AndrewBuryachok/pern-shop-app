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

  const actions = props.actions
    .filter((action) => user || action.color == Color.BLUE)
    .map(({ disable, ...action }) => ({
      ...action,
      disabled: disable(props.data),
    }));

  const unique = actions
    .filter(
      (action, index) =>
        actions.map((action) => action.color).indexOf(action.color) === index,
    )
    .map((action) => action.color);

  const grouped = unique.map((color) =>
    actions.filter((action) => action.color === color),
  );

  const sorted = grouped.map(
    (action) =>
      action.sort(
        (a, b) =>
          b.color - a.color ||
          (a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1),
      )[0],
  );

  return (
    <Group spacing={4}>
      {sorted.map((action) => (
        <ActionIcon
          key={action.color}
          size={24}
          variant='filled'
          color={colors[action.color - 1]}
          onClick={() => action.open(props.data)}
          disabled={action.disabled}
        >
          {icons[action.color - 1]}
        </ActionIcon>
      ))}
    </Group>
  );
}
