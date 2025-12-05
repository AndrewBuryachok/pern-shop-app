import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useCompleteShopMutation } from './shops.api';
import { CompleteShopDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function CompleteShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopId: shop.id,
    },
  });

  const [completeShop, { isLoading }] = useCompleteShopMutation();

  const handleSubmit = async (dto: CompleteShopDto) => {
    await completeShop(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.shops')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shop.card.user} />}
        iconWidth={48}
        value={parseCard(shop.card)}
        readOnly
      />
      <TextInput label={t('columns.shop')} value={shop.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={shop.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={shop.x} readOnly />
      <TextInput label={t('columns.y')} value={shop.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(shop.createdAt)}
        readOnly
      />
    </CustomForm>
  );
}

export const completeShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.shops'),
      children: <CompleteShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.RED,
};
