import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Friend } from './friend.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Friend>;

export default function ViewFriendModal({ data: friend }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...friend.senderUser} />}
        iconWidth={48}
        value={friend.senderUser.name}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...friend.receiverUser} />}
        iconWidth={48}
        value={friend.receiverUser.name}
        disabled
      />
      <TextInput
        label={t('columns.type')}
        value={
          friend.type ? t('constants.confirmed') : t('constants.unconfirmed')
        }
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(friend.createdAt)}
        disabled
      />
    </Stack>
  );
}

export const viewFriendAction = {
  open: (friend: Friend) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.friend'),
      children: <ViewFriendModal data={friend} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
