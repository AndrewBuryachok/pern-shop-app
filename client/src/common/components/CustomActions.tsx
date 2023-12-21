import { ActionIcon, Group, Menu } from '@mantine/core';
import {
  IconDots,
  IconEye,
  IconMinus,
  IconPencil,
  IconPlus,
} from '@tabler/icons';
import { IAction, IModal } from '../interfaces';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { openAuthModal } from '../../features/auth/AuthModal';
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
    <IconEye size={16} />,
  ];

  const actions = props.actions.map(({ disable, open, ...action }) => ({
    ...action,
    open: user || action.color === Color.BLUE ? open : openAuthModal,
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
    <Menu offset={4} position='left' trigger='hover'>
      <Menu.Target>
        <ActionIcon size={24}>
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
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
      </Menu.Dropdown>
    </Menu>
  );
}
