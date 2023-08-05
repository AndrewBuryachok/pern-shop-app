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
import { Trade } from './trade.model';
import { useRateTradeMutation } from './trades.api';
import { RateTradeDto } from './trade.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseTradeAmount } from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Trade>;

export default function RateTradeModal({ data: trade }: Props) {
  const form = useForm({
    initialValues: {
      tradeId: trade.id,
      rate: trade.rate || 0,
    },
  });

  const [rateTrade, { isLoading }] = useRateTradeMutation();

  const handleSubmit = async (dto: RateTradeDto) => {
    await rateTrade(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Rate trade'}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...trade.ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...trade.ware} />}
        iconWidth={48}
        value={items[trade.ware.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={trade.ware.description} disabled />
      <TextInput label='Amount' value={parseTradeAmount(trade)} disabled />
      <TextInput
        label='Sum'
        value={`${trade.amount * trade.ware.price}$`}
        disabled
      />
      <Input.Wrapper label='Rate' required>
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

export const rateTradeAction = {
  open: (trade: Trade) =>
    openModal({
      title: 'Rate Trade',
      children: <RateTradeModal data={trade} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
