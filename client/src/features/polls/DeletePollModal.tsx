import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useDeletePollMutation } from './polls.api';
import { DeletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { Color, marks } from '../../common/constants';

type Props = IModal<Poll>;

export default function DeletePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
    },
  });

  const [deletePoll, { isLoading }] = useDeletePollMutation();

  const handleSubmit = async (dto: DeletePollDto) => {
    await deletePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.polls')}
    >
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
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={poll.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={poll.video} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const deletePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.polls'),
      children: <DeletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.RED,
};
