import { Text } from '@mantine/core';
import { colors } from '../constants';

type Props = {
  text: string;
  color?: number;
};

export default function SingleText(props: Props) {
  return (
    <Text size='xs' color={props.color ? colors[props.color - 1] : undefined}>
      {props.text}
    </Text>
  );
}
