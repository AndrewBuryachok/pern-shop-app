import { ThemeIcon } from '@mantine/core';
import { IconChevronsDown, IconChevronsUp, IconEqual } from '@tabler/icons';
import { colors } from '../constants';

type Props = {
  priority: number;
};

export default function PriorityIcon(props: Props) {
  const icons = [
    <IconChevronsUp size={16} />,
    <IconEqual size={16} />,
    <IconChevronsDown size={16} />,
  ];

  return (
    <ThemeIcon size={24} variant='filled' color={colors[props.priority - 1]}>
      {icons[props.priority - 1]}
    </ThemeIcon>
  );
}
