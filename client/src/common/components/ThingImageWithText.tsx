import { Group } from '@mantine/core';
import ThingImage from './ThingImage';
import SingleText from './SingleText';
import DoubleText from './DoubleText';
import { items } from '../constants';

type Props = {
  item: number;
  description?: string;
};

export default function ThingImageWithText(props: Props) {
  const text = items[props.item - 1].split(': ')[1];

  return (
    <Group spacing={8}>
      <ThingImage {...props} />
      {!props.description || props.description === '-' ? (
        <SingleText text={text} />
      ) : (
        <div>
          <DoubleText text={text} subtext={props.description} />
        </div>
      )}
    </Group>
  );
}
