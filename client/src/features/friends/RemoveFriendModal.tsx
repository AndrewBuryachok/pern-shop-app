import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Friend } from './friend.model';
import { useRemoveFriendMutation } from './friends.api';
import { UpdateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Friend>;

export default function RemoveFriendModal({ data: friend }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      friendId: friend.id,
    },
  });

  const [removeFriend, { isLoading }] = useRemoveFriendMutation();

  const handleSubmit = async (dto: UpdateFriendDto) => {
    await removeFriend(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.friend')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...friend.senderUser} />}
        iconWidth={48}
        value={friend.senderUser.nick}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...friend.receiverUser} />}
        iconWidth={48}
        value={friend.receiverUser.nick}
        disabled
      />
    </CustomForm>
  );
}

export const removeFriendAction = {
  open: (friend: Friend) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.friend'),
      children: <RemoveFriendModal data={friend} />,
    }),
  disable: () => false,
  color: Color.RED,
};
