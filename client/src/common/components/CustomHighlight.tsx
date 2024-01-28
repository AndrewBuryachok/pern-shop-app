import { Highlight } from '@mantine/core';

type Props = {
  text: string;
};

export default function CustomHighlight(props: Props) {
  return (
    <Highlight
      size='xs'
      highlightColor='violet'
      highlight={/@\w+/.exec(props.text) || []}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {props.text}
    </Highlight>
  );
}
