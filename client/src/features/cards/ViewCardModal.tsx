import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Card } from './card.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color, colors } from '../../common/constants';

type Props = IModal<Card>;

export default function ViewCardModal({ data: card }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...card.user} />}
        iconWidth={48}
        value={card.user.name}
        disabled
      />
      <TextInput label='Card' value={card.name} disabled />
      <TextInput label='Color' value={colors[card.color - 1]} disabled />
      <TextInput label='Balance' value={`${card.balance}$`} disabled />
    </Stack>
  );
}

export const viewCardAction = {
  open: (card: Card) =>
    openModal({
      title: 'View Card',
      children: <ViewCardModal data={card} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
