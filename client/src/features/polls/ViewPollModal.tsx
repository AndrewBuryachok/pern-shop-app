import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color, marks, results } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={poll.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        readOnly
      />
      <Textarea label={t('columns.text')} value={poll.text} autosize readOnly />
      <TextInput
        label={t('columns.mark')}
        value={t(`constants.marks.${marks[poll.mark - 1]}`)}
        readOnly
      />
      <TextInput
        label={t('columns.result')}
        value={t(`constants.results.${results[poll.result - 1]}`)}
        readOnly
      />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={poll.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={poll.video} />
      </Input.Wrapper>
      <TextInput
        label={t('columns.created')}
        value={parseTime(poll.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(poll.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.polls'),
      children: <ViewPollModal data={poll} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
