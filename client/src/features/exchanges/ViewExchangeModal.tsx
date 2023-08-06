import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Exchange>;

export default function ViewExchangeModal({ data: exchange }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Executor'
        icon={<CustomAvatar {...exchange.executorUser} />}
        iconWidth={48}
        value={exchange.executorUser.name}
        disabled
      />
      <TextInput
        label='Customer'
        icon={<CustomAvatar {...exchange.customerCard.user} />}
        iconWidth={48}
        value={parseCard(exchange.customerCard)}
        disabled
      />
      <TextInput
        label='Type'
        value={exchange.type ? 'increase' : 'decrease'}
        disabled
      />
      <TextInput label='Sum' value={`${exchange.sum}$`} disabled />
      <TextInput
        label='Created'
        value={parseTime(exchange.createdAt)}
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
