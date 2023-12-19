import { Image } from '@mantine/core';

type Props = {
  image: string;
};

export default function CustomImage(props: Props) {
  return <Image height={200} radius='md' src={props.image} withPlaceholder />;
}
