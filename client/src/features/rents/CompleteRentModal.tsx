import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import { useCompleteRentMutation } from './rents.api';
import { RentIdDto } from './rent.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseStore } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rent>;

export default function CompleteRentModal({ data: rent }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      rentId: rent.id,
    },
  });

  const [completeRent, { isLoading }] = useCompleteRentMutation();

  const handleSubmit = async (dto: RentIdDto) => {
    await completeRent(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.rents')}
    >
      <TextInput
        label={t('columns.renter')}
        icon={<CustomAvatar {...rent.card.user} />}
        iconWidth={48}
        value={parseCard(rent.card)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(rent.store.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.storage')}
        value={parseStore(rent.store)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${rent.store.market.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const completeRentAction = {
  open: (rent: Rent) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.rents'),
      children: <CompleteRentModal data={rent} />,
    }),
  disable: (rent: Rent) => rent.completedAt > new Date(),
  color: Color.RED,
};
