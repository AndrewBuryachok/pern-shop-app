import { Group } from '@mantine/core';
import ThingImage from './ThingImage';
import SingleText from './SingleText';
import DoubleText from './DoubleText';
import { parseItem } from '../utils';

type Props = {
  item: string;
  description?: string;
};

export default function ThingImageWithText(props: Props) {
  const text = parseItem(props.item);

  return (
    <Group spacing={8}>
      <ThingImage {...props} />
      {!props.description ? (
        <SingleText text={text} />
      ) : (
        <div>
          <DoubleText text={text} subtext={props.description} dimmed />
        </div>
      )}
    </Group>
  );
}
