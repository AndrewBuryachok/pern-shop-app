import { items } from '../constants';

type Props = {
  item: string;
};

export default function ThingImage(props: Props) {
  const index = items.indexOf(props.item);
  const x = -32 * (index % 30);
  const y = -32 * Math.floor(index / 30);

  return (
    <div
      style={{
        width: 32,
        height: 32,
        backgroundImage: 'url(/items.png)',
        backgroundSize: 960,
        backgroundPositionX: x,
        backgroundPositionY: y,
        imageRendering: 'pixelated',
      }}
    />
  );
}
