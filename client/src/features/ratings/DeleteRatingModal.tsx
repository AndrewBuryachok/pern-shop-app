import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Rating as CustomRating, Input, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rating } from './rating.model';
import { useDeleteRatingMutation } from './ratings.api';
import { DeleteRatingDto } from './rating.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Rating>;

export default function DeleteRatingModal({ data: rating }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      ratingId: rating.id,
    },
  });

  const [removeRatingRole, { isLoading }] = useDeleteRatingMutation();

  const handleSubmit = async (dto: DeleteRatingDto) => {
    await removeRatingRole(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.rating')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...rating.senderUser} />}
        iconWidth={48}
        value={rating.senderUser.nick}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...rating.receiverUser} />}
        iconWidth={48}
        value={rating.receiverUser.nick}
        disabled
      />
      <Input.Wrapper label={t('columns.rate')}>
        <CustomRating value={rating.rate} readOnly />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const deleteRatingAction = {
  open: (rating: Rating) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.rating'),
      children: <DeleteRatingModal data={rating} />,
    }),
  disable: () => false,
  color: Color.RED,
};
