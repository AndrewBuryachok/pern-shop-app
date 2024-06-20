import { Divider, Flex } from '@mantine/core';
import { SmReply } from '../../features/replies/reply.model';
import CustomAvatar from './CustomAvatar';
import SingleText from './SingleText';
import CustomHighlight from './CustomHighlight';
import { parseTime } from '../utils';

type Props = SmReply & {
  divider?: boolean;
  right?: boolean;
};

export default function ReplyAvatarWithText(props: Props) {
  return (
    <Flex
      gap={8}
      direction={props.right ? 'row-reverse' : 'row'}
      align='flex-start'
      wrap='nowrap'
    >
      {props.divider && <Divider size='xl' orientation='vertical' />}
      <CustomAvatar {...props.user} />
      <div>
        <Flex gap={8} direction={props.right ? 'row-reverse' : 'row'}>
          <SingleText text={props.user.nick} bold />
          <SingleText text={parseTime(props.createdAt)} dimmed />
        </Flex>
        <CustomHighlight text={props.text} />
      </div>
    </Flex>
  );
}
