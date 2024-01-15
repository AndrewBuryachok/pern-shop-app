import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useEditPollMutation } from './polls.api';
import { EditPollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { selectMarks } from '../../common/utils';
import {
  Color,
  MAX_LINK_LENGTH,
  MAX_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Poll>;

export default function EditPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      text: poll.text,
      mark: `${poll.mark}`,
      image: poll.image,
      video: poll.video,
    },
    transformValues: ({ mark, ...rest }) => ({ ...rest, mark: +mark }),
  });

  const [image] = useDebouncedValue(form.values.image, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const [editPoll, { isLoading }] = useEditPollMutation();

  const handleSubmit = async (dto: EditPollDto) => {
    await editPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.polls')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Select
        label={t('columns.mark')}
        placeholder={t('columns.mark')}
        data={selectMarks()}
        searchable
        required
        {...form.getInputProps('mark')}
      />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        description={t('information.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
    </CustomForm>
  );
}

export const editPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.polls'),
      children: <EditPollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.YELLOW,
};
