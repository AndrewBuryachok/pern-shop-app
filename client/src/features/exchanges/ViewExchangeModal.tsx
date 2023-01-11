import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import { parseCard, parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Exchange>;

export default function ViewExchangeModal({ data: exchange }: Props) {
  const created = parseDate(exchange.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput label='Executor' value={exchange.executorUser.name} disabled />
      <TextInput
        label='Customer'
        value={parseCard(exchange.customerCard)}
        disabled
      />
      <TextInput
        label='Type'
        value={exchange.type ? 'increase' : 'reduce'}
        disabled
      />
      <TextInput label='Sum' value={`${exchange.sum}$`} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewExchangeAction = {
  open: (exchange: Exchange) =>
    openModal({
      title: 'View Exchange',
      children: <ViewExchangeModal data={exchange} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
