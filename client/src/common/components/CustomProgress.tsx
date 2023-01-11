import { Progress } from '@mantine/core';

type Props = {
  upVotes: number;
  downVotes: number;
  myVote?: { type: boolean };
};

export default function CustomProgress(props: Props) {
  const total = props.upVotes + props.downVotes;
  const color = props.myVote ? (props.myVote.type ? 'green' : 'red') : 'violet';

  return (
    <Progress
      aria-label='Results'
      size='xl'
      radius='xl'
      sections={
        total
          ? [props.upVotes, props.downVotes].map((value, index) => ({
              value: (value * 100) / total,
              label: `${value}`,
              color: [color, 'gray'][color === 'red' ? 1 - index : index],
            }))
          : [{ value: 100, label: '0', color: 'gray' }]
      }
    />
  );
}
