import { Group } from '@mantine/core';
import PriorityIcon from './PriorityIcon';
import SingleText from './SingleText';
import { priorities } from '../constants';

type Props = {
  priority: number;
};

export default function PriorityIconWithText(props: Props) {
  return (
    <Group spacing={8}>
      <PriorityIcon {...props} />
      <SingleText text={priorities[props.priority - 1]} />
    </Group>
  );
}
