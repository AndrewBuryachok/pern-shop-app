type Props = {
  item: number;
};

export default function ThingImage(props: Props) {
  const x = -32 * ((props.item - 1) % 32);
  const y = -32 * Math.floor((props.item - 1) / 32);

  return (
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
  );
}
