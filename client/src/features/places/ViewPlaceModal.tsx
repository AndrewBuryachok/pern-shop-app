import { NativeSelect, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace } from './place.model';

type Props = IModal<ExtPlace>;

export default function PlaceModal({ data: place }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput label='Owner' value={place.owner} disabled />
      <TextInput label='Name' value={place.name} disabled />
      <TextInput label='X' value={place.x} disabled />
      <TextInput label='Y' value={place.y} disabled />
      {place.price && <TextInput label='Price' value={place.price} disabled />}
      <NativeSelect
        label={['Users', 'Goods', 'Stores', 'Cells'][place.type]}
        data={place.data}
      />
    </Stack>
  );
}

export const openPlaceModal = (place: ExtPlace) =>
  openModal({
    title: `View ${['City', 'Shop', 'Market', 'Storage'][place.type]}`,
    children: <PlaceModal data={place} />,
  });
