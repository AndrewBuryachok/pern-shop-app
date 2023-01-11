import { Text } from '@mantine/core';
import SingleText from './SingleText';
import { colors } from '../constants';

type Props = {
  text: string;
  subtext: string;
  color?: number;
};

export default function DoubleText(props: Props) {
  return (
    <>
      <SingleText text={props.text} />
      <Text size='xs' color={props.color ? colors[props.color - 1] : undefined}>
        {props.subtext}
      </Text>
    </>
  );
}
