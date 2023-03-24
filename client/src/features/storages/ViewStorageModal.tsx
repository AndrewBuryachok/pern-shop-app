import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, viewContainers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Storage>;

export default function ViewStorageModal({ data: storage }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...storage.card.user} />}
        iconWidth={48}
        value={parseCard(storage.card)}
        disabled
      />
      <TextInput label='Storage' value={storage.name} disabled />
      <TextInput label='X' value={storage.x} disabled />
      <TextInput label='Y' value={storage.y} disabled />
      <TextInput label='Price' value={`${storage.price}$`} disabled />
      <Select
        label='Cells'
        placeholder={`Total: ${storage.cells.length}`}
        data={viewContainers(storage.cells)}
        searchable
      />
    </Stack>
  );
}

export const viewStorageAction = {
  open: (storage: Storage) =>
    openModal({
      title: 'View Storage',
      children: <ViewStorageModal data={storage} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
