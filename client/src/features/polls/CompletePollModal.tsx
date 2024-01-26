import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCompletePollMutation } from './polls.api';
import { CompletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { ColorsItem } from '../../common/components/ColorsItem';
import { selectPollTypes } from '../../common/utils';
import { Color, marks } from '../../common/constants';

type Props = IModal<Poll>;

export default function CompletePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      type: '',
    },
    transformValues: ({ type, ...rest }) => ({
      ...rest,
      type: !!+type,
    }),
  });

  const [completePoll, { isLoading }] = useCompletePollMutation();

  const handleSubmit = async (dto: CompletePollDto) => {
    await completePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.polls')}
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
      <Select
        label={t('columns.result')}
        placeholder={t('columns.result')}
        itemComponent={ColorsItem}
        data={selectPollTypes()}
        searchable
        required
        {...form.getInputProps('type')}
      />
    </CustomForm>
  );
}

export const completePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.polls'),
      children: <CompletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};
