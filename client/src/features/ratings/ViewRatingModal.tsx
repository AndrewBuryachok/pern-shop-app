import { Rating as CustomRating, Input, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rating } from './rating.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rating>;

export default function ViewRatingModal({ data: rating }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...rating.senderUser} />}
        iconWidth={48}
        value={rating.senderUser.name}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...rating.receiverUser} />}
        iconWidth={48}
        value={rating.receiverUser.name}
        disabled
      />
      <Input.Wrapper label='Rate'>
        <CustomRating value={rating.rate} readOnly />
      </Input.Wrapper>
      <TextInput label='Created' value={parseTime(rating.createdAt)} disabled />
    </Stack>
  );
}

export const viewRatingAction = {
  open: (rating: Rating) =>
    openModal({
      title: 'View Rating',
      children: <ViewRatingModal data={rating} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
