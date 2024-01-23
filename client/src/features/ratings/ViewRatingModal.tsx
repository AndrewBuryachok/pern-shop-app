import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Rating as CustomRating, Input, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rating } from './rating.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rating>;

export default function ViewRatingModal({ data: rating }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={rating.id} readOnly />
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...rating.senderUser} />}
        iconWidth={48}
        value={rating.senderUser.nick}
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...rating.receiverUser} />}
        iconWidth={48}
        value={rating.receiverUser.nick}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <CustomRating value={rating.rate} readOnly />
      </Input.Wrapper>
      <TextInput
        label={t('columns.created')}
        value={parseTime(rating.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewRatingAction = {
  open: (rating: Rating) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.ratings'),
      children: <ViewRatingModal data={rating} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
