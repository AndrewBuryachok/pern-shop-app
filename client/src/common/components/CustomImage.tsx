import { Image } from '@mantine/core';
import { useToggle } from '@mantine/hooks';

type Props = {
  image: string;
};

export default function CustomImage(props: Props) {
  const [value, toggle] = useToggle();

  return (
    <Image
      height={value ? undefined : 200}
      onClick={() => props.image && toggle()}
      style={{ cursor: 'pointer' }}
      radius='md'
      src={props.image}
      withPlaceholder
    />
  );
}
