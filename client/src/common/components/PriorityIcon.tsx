import { ThemeIcon } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconChevronsDown,
  IconChevronsUp,
  IconEqual,
} from '@tabler/icons';

type Props = {
  priority: number;
};

export default function PriorityIcon(props: Props) {
  const icons = [
    <IconChevronsDown size={16} />,
    <IconChevronDown size={16} />,
    <IconEqual size={16} />,
    <IconChevronUp size={16} />,
    <IconChevronsUp size={16} />,
  ];

  const colors = ['blue', 'green', 'yellow', 'orange', 'red'];

  return (
    <ThemeIcon size={24} variant='filled' color={colors[props.priority - 1]}>
      {icons[props.priority - 1]}
    </ThemeIcon>
  );
}
