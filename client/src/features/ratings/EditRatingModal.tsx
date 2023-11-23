import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Rating as CustomRating, Input, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rating } from './rating.model';
import { useEditRatingMutation } from './ratings.api';
import { EditRatingDto } from './rating.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Rating>;

export default function EditRatingModal({ data: rating }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      ratingId: rating.id,
      rate: rating.rate,
    },
  });

  const [editRating, { isLoading }] = useEditRatingMutation();

  const handleSubmit = async (dto: EditRatingDto) => {
    await editRating(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.rating')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...rating.senderUser} />}
        iconWidth={48}
        value={rating.senderUser.name}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...rating.receiverUser} />}
        iconWidth={48}
        value={rating.receiverUser.name}
        disabled
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <CustomRating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const editRatingAction = {
  open: (rating: Rating) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.rating'),
      children: <EditRatingModal data={rating} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
