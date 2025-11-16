import { Image } from '@mantine/core';

type Props = {
  image: string;
};

export default function CustomImage(props: Props) {
  return (
    <Image
      radius='md'
      src={props.image}
      withPlaceholder
      imageProps={{ loading: 'lazy' }}
    />
  );
}
