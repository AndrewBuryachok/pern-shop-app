import { Group } from '@mantine/core';
import ThingImage from './ThingImage';
import SingleText from './SingleText';
import DoubleText from './DoubleText';
import { parseItem } from '../utils';

type Props = {
  item: number;
  description?: string;
};

export default function ThingImageWithText(props: Props) {
  const text = parseItem(props.item);

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
