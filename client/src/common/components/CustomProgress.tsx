import { Group, Progress, Text } from '@mantine/core';

type Props = {
  upVotes: number;
  downVotes: number;
};

export default function CustomProgress(props: Props) {
  const total = props.upVotes + props.downVotes;
  const sections = [props.upVotes, props.downVotes].map((value, index) => ({
    value: total && (value * 100) / total,
    color: ['violet', 'gray'][index],
  }));

  return (
    <>
      <Group spacing={0} position='apart'>
        {[props.upVotes, props.downVotes].map((value, index) => (
          <Text key={index} size='xs' weight='bold'>
            {value}
          </Text>
        ))}
      </Group>
      <Progress sections={sections} />
    </>
  );
}
