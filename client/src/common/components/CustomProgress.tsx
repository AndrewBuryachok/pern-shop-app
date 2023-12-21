import { Group, Progress, Text } from '@mantine/core';
import { Vote } from '../../features/polls/vote.model';

type Props = {
  votes: Vote[];
};

export default function CustomProgress(props: Props) {
  const upVotes = props.votes.filter((vote) => vote.type).length;
  const downVotes = props.votes.filter((vote) => !vote.type).length;
  const total = upVotes + downVotes;
  const sections = [upVotes, downVotes].map((value, index) => ({
    value: total && (value * 100) / total,
    color: ['violet', 'gray'][index],
  }));

  return (
    <>
      <Group position='apart'>
        {[upVotes, downVotes].map((value, index) => (
          <Text key={index} size='xs' weight='bold'>
            {value}
          </Text>
        ))}
      </Group>
      <Progress sections={sections} />
    </>
  );
}
