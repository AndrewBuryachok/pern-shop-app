import { Text } from '@mantine/core';
import { colors } from '../constants';

type Props = {
  text: string;
  color?: number;
  bold?: boolean;
  dimmed?: boolean;
};

export default function SingleText(props: Props) {
  return (
    <Text
      size='xs'
      weight={props.bold ? 'bold' : undefined}
      color={
        props.color
          ? colors[props.color - 1]
          : props.dimmed
          ? 'dimmed'
          : undefined
      }
    >
      {props.text}
    </Text>
  );
}
