import { Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useCompleteLotMutation } from './lots.api';
import { CompleteLotDto } from './lot.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Lot>;

export default function CompleteLotModal({ data: lot }: Props) {
  const form = useForm({
    initialValues: {
      lotId: lot.id,
      price: lot.price,
    },
  });

  const [completeLot, { isLoading }] = useCompleteLotMutation();

  const handleSubmit = async (dto: CompleteLotDto) => {
    await completeLot(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Complete lot'}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={items[lot.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={lot.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(lot)} disabled />
      <TextInput label='Price' value={`${lot.price}$`} disabled />
      <Select
        label='Bids'
        placeholder={`Total: ${lot.bids.length}`}
        itemComponent={StatesItem}
        data={viewStates(lot.bids)}
        searchable
      />
      <TextInput label='Market' value={parseCell(lot.lease.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Created' value={parseTime(lot.createdAt)} disabled />
    </CustomForm>
  );
}

export const completeLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: 'Complete Lot',
      children: <CompleteLotModal data={lot} />,
    }),
  disable: (lot: Lot) => !!lot.completedAt,
  color: Color.GREEN,
};
