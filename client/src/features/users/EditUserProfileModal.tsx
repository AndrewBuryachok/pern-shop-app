import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditUserProfileMutation } from './users.api';
import { EditUserProfileDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ColorsItem } from '../../common/components/ColorsItem';
import { isUserNotHasRole, selectColors } from '../../common/utils';
import {
  Color,
  MAX_NICK_LENGTH,
  MIN_NICK_LENGTH,
  Role,
} from '../../common/constants';

type Props = IModal<ExtUser>;

export default function EditUserProfileModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
      discord: user.discord,
      avatar: user.avatar,
      color: `${user.color}`,
    },
    transformValues: ({ color, ...rest }) => ({ ...rest, color: +color }),
  });

  const [editUserProfile, { isLoading }] = useEditUserProfileMutation();

  const handleSubmit = async (dto: EditUserProfileDto) => {
    await editUserProfile(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('columns.profile')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        disabled
      />
      <TextInput
        label={t('columns.discord')}
        placeholder={t('columns.discord')}
        minLength={MIN_NICK_LENGTH}
        maxLength={MAX_NICK_LENGTH}
        {...form.getInputProps('discord')}
      />
      <TextInput
        label={t('columns.avatar')}
        placeholder={t('columns.avatar')}
        minLength={MIN_NICK_LENGTH}
        maxLength={MAX_NICK_LENGTH}
        {...form.getInputProps('avatar')}
      />
      <Select
        label={t('columns.color')}
        placeholder={t('columns.color')}
        itemComponent={ColorsItem}
        data={selectColors()}
        searchable
        required
        {...form.getInputProps('color')}
      />
    </CustomForm>
  );
}

export const editUserProfileAction = {
  open: (user: ExtUser) =>
    openModal({
      title: t('actions.edit') + ' ' + t('columns.profile'),
      children: <EditUserProfileModal data={user} />,
    }),
  disable: (user: ExtUser) => {
    const me = getCurrentUser();
    return isUserNotHasRole(Role.ADMIN) && user.id !== me?.id;
  },
  color: Color.YELLOW,
};
