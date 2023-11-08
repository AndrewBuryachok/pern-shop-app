import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  Group,
  Input,
  Rating,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Sale } from './sale.model';
import { useRateSaleMutation } from './sales.api';
import { RateSaleDto } from './sale.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseSaleAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Sale>;

export default function RateSaleModal({ data: sale }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      saleId: sale.id,
      rate: sale.rate || 0,
    },
  });

  const [rateSale, { isLoading }] = useRateSaleMutation();

  const handleSubmit = async (dto: RateSaleDto) => {
    await rateSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.sale')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...sale.product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(sale.product.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...sale.product} />}
        iconWidth={48}
        value={parseItem(sale.product.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={sale.product.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseSaleAmount(sale)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${sale.amount * sale.product.price}$`}
        disabled
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateSaleAction = {
  open: (sale: Sale) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.sale'),
      children: <RateSaleModal data={sale} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
