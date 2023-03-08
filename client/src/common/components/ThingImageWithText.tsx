import { Group } from '@mantine/core';
import ThingImage from './ThingImage';
import DoubleText from './DoubleText';
import { items } from '../constants';

type Props = {
  item: number;
  description: string;
};

export default function ThingImageWithText(props: Props) {
  return (
    <Group spacing={8}>
      <ThingImage item={props.item} />
      <div>
        <DoubleText
          text={items[props.item - 1].substring(3)}
          subtext={props.description}
        />
      </div>
    </Group>
  );
}
