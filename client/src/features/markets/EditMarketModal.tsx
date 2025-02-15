import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
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
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
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
      description: market.description,
      x: market.x,
      y: market.y,
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
      text={t('actions.edit') + ' ' + t('modals.markets')}
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
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
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
    </CustomForm>
  );
}

export const editMarketAction = {
  open: (market: Market) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.markets'),
      children: <EditMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
