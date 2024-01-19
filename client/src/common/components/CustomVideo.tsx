import { AspectRatio } from '@mantine/core';

type Props = {
  video: string;
};

export default function CustomVideo(props: Props) {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src={props.video}
        title='YouTube video player'
        style={{ border: 0 }}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </AspectRatio>
  );
}
