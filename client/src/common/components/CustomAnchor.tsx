import { Anchor } from '@mantine/core';

type Props = {
  text: string;
  open: () => void;
};

export default function CustomAnchor(props: Props) {
  return (
    <Anchor
      component='button'
      type='button'
      onClick={props.open}
      size='xs'
      color='dimmed'
      underline
    >
      {props.text}
    </Anchor>
  );
}
