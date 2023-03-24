import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, viewContainers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Market>;

export default function ViewMarketModal({ data: market }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...market.card.user} />}
        iconWidth={48}
        value={parseCard(market.card)}
        disabled
      />
      <TextInput label='Market' value={market.name} disabled />
      <TextInput label='X' value={market.x} disabled />
      <TextInput label='Y' value={market.y} disabled />
      <TextInput label='Price' value={`${market.price}$`} disabled />
      <Select
        label='Stores'
        placeholder={`Total: ${market.stores.length}`}
        data={viewContainers(market.stores)}
        searchable
      />
    </Stack>
  );
}

export const viewMarketAction = {
  open: (market: Market) =>
    openModal({
      title: 'View Market',
      children: <ViewMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
