import { Anchor } from '@mantine/core';

type Props = {
  text: string;
  onClick: () => void;
};

export default function CustomAnchor(props: Props) {
  return (
    <Anchor
      component='button'
      type='button'
      onClick={props.onClick}
      size='xs'
      color='dimmed'
      underline
    >
      {props.text}
    </Anchor>
  );
}
