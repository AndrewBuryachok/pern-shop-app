type Props = {
  item: number;
};

export default function ThingImage(props: Props) {
  const x = -32 * ((props.item - 1) % 30);
  const y = -32 * Math.floor((props.item - 1) / 30);

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
