import { Group, Paper, Stack, ThemeIcon } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import DateText from '../../common/components/DateText';
import SingleText from '../../common/components/SingleText';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import CustomActions from '../../common/components/CustomActions';
import ViewPlaintAnswersModal from './ViewPlaintAnswersModal';
import { viewPlaintAction } from './ViewPlaintModal';

type Props = {
  plaint: Plaint;
  actions: IAction<Plaint>[];
};

export default function PlaintPaper({ plaint, ...props }: Props) {
  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <AvatarWithSingleText {...plaint.senderUser} />
            <ThemeIcon size={24} variant='light' color='gray'>
              <IconChevronRight size={16} />
            </ThemeIcon>
            <AvatarWithSingleText {...plaint.receiverUser} />
            <div>
              <DateText date={plaint.createdAt} />
            </div>
          </Group>
          <CustomActions
            data={plaint}
            actions={[viewPlaintAction, ...props.actions]}
          />
        </Group>
        <SingleText text={plaint.title} bold />
        {plaint.text && (
          <ReplyAvatarWithText
            {...plaint}
            user={plaint.executorUser!}
            text={plaint.text}
            createdAt={plaint.completedAt!}
          />
        )}
        <ViewPlaintAnswersModal data={plaint} />
      </Stack>
    </Paper>
  );
}
