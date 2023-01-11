import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Cell } from './cell.model';
import { parseCard, parseDate, parsePlace } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Cell>;

export default function ViewCellModal({ data: cell }: Props) {
  const reserved = cell.reservedAt && parseDate(cell.reservedAt);

  return (
    <Stack spacing={8}>
      <TextInput label='Owner' value={parseCard(cell.storage.card)} disabled />
      <TextInput label='Storage' value={parsePlace(cell.storage)} disabled />
      <TextInput label='Cell' value={`#${cell.name}`} disabled />
      <TextInput label='Price' value={`${cell.storage.price}$`} disabled />
      <TextInput
        label='Reserved'
        value={reserved ? `${reserved.date} ${reserved.time}` : '-'}
        disabled
      />
    </Stack>
  );
}

export const viewCellAction = {
  open: (cell: Cell) =>
    openModal({
      title: 'View Cell',
      children: <ViewCellModal data={cell} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
