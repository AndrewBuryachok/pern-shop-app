import { Group } from '@mantine/core';
import DoubleText from './DoubleText';
import { items } from '../constants';

type Props = {
  item: number;
  description: string;
};

export default function ItemImage(props: Props) {
  const x = -32 * ((props.item - 1) % 32);
  const y = -32 * Math.floor((props.item - 1) / 32);

  return (
    <Group spacing={8}>
      <div
        style={{
          width: 32,
          height: 32,
          backgroundImage: 'url(/items.png)',
          backgroundPositionX: x,
          backgroundPositionY: y,
          imageRendering: 'pixelated',
        }}
      />
      <div>
        <DoubleText
          text={items[props.item - 1].substring(3)}
          subtext={props.description}
        />
      </div>
    </Group>
  );
}
