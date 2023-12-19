import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import { useEditMarketMutation } from './markets.api';
import { EditMarketDto } from './market.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_COORDINATE_VALUE,
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
} from '../../common/constants';

type Props = IModal<Market>;

export default function EditMarketModal({ data: market }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      marketId: market.id,
      name: market.name,
      x: market.x,
      y: market.y,
      price: market.price,
    },
  });

  const [editMarket, { isLoading }] = useEditMarketMutation();

  const handleSubmit = async (dto: EditMarketDto) => {
    await editMarket(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.market')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.name')}
        placeholder={t('columns.name')}
        required
        minLength={MIN_NAME_LENGTH}
        maxLength={MAX_NAME_LENGTH}
        {...form.getInputProps('name')}
      />
      <NumberInput
        label={t('columns.x')}
        placeholder={t('columns.x')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('x')}
      />
      <NumberInput
        label={t('columns.y')}
        placeholder={t('columns.y')}
        required
        min={MIN_COORDINATE_VALUE}
        max={MAX_COORDINATE_VALUE}
        {...form.getInputProps('y')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editMarketAction = {
  open: (market: Market) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.market'),
      children: <EditMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
