import { useState } from 'react';
import { AspectRatio, Image, Skeleton } from '@mantine/core';

type Props = {
  image: string;
  isFirst: boolean;
};

export default function CustomImage(props: Props) {
  const [loaded, setLoaded] = useState(false);

  const onLoad = () => setLoaded(true);

  return (
    <>
      <Image
        radius='md'
        src={props.image}
        withPlaceholder
        imageProps={{ loading: 'lazy' }}
        onLoad={onLoad}
        style={{ height: loaded ? undefined : 0 }}
      />
      {props.isFirst && !loaded && (
        <AspectRatio ratio={16 / 9}>
          <Skeleton />
        </AspectRatio>
      )}
    </>
  );
}
