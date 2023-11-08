import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Ware } from './ware.model';
import { useEditWareMutation } from './wares.api';
import { EditWareDto } from './ware.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseItem,
  parseStore,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Ware>;

export default function EditWareModal({ data: ware }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      wareId: ware.id,
      price: ware.price,
    },
  });

  const [editWare, { isLoading }] = useEditWareMutation();

  const handleSubmit = async (dto: EditWareDto) => {
    await editWare(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.ware')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...ware} />}
        iconWidth={48}
        value={parseItem(ware.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={ware.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(ware)}
        disabled
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
      <Select
        label={t('columns.prices')}
        placeholder={`Total: ${ware.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(ware.states)}
        searchable
      />
      <TextInput
        label={t('columns.market')}
        value={parseStore(ware.rent.store)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...ware.rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(ware.rent.store.market.card)}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(ware.createdAt)}
        disabled
      />
    </CustomForm>
  );
}

export const editWareAction = {
  open: (ware: Ware) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.ware'),
      children: <EditWareModal data={ware} />,
    }),
  disable: (ware: Ware) => !ware.amount,
  color: Color.YELLOW,
};
