import { AspectRatio } from '@mantine/core';

type Props = {
  nick: string;
};

export default function CustomStream(props: Props) {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        width='100%'
        height='100%'
        src={`https://player.twitch.tv/?channel=${props.nick}&parent=${
          import.meta.env.VITE_APP_URL
        }`}
        style={{ border: 0 }}
        allowFullScreen
      />
    </AspectRatio>
  );
}
