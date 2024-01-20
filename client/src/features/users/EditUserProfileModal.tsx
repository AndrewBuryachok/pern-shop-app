import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditUserProfileMutation } from './users.api';
import { EditUserProfileDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ProfileAvatar from '../../common/components/ProfileAvatar';
import { isUserNotHasRole, selectBackgrounds } from '../../common/utils';
import {
  Color,
  MAX_CONTACT_LENGTH,
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
      avatar: user.avatar,
      background: `${user.background}`,
      discord: user.discord,
      twitch: user.twitch,
      youtube: user.youtube,
    },
    transformValues: ({ background, ...rest }) => ({
      ...rest,
      background: +background,
    }),
  });

  const [avatar] = useDebouncedValue(form.values.avatar, 500);

  const [editUserProfile, { isLoading }] = useEditUserProfileMutation();

  const handleSubmit = async (dto: EditUserProfileDto) => {
    await editUserProfile(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('columns.profile')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        disabled
      />
      <TextInput
        label={t('columns.avatar')}
        placeholder={t('columns.avatar')}
        minLength={MIN_NICK_LENGTH}
        maxLength={MAX_NICK_LENGTH}
        {...form.getInputProps('avatar')}
      />
      <Select
        label={t('columns.background')}
        placeholder={t('columns.background')}
        data={selectBackgrounds()}
        searchable
        required
        {...form.getInputProps('background')}
      />
      <ProfileAvatar
        {...user}
        avatar={avatar}
        background={+form.values.background}
      />
      <TextInput
        label={t('columns.discord')}
        placeholder={t('columns.discord')}
        maxLength={MAX_CONTACT_LENGTH}
        {...form.getInputProps('discord')}
      />
      <TextInput
        label={t('columns.twitch')}
        placeholder={t('columns.twitch')}
        maxLength={MAX_CONTACT_LENGTH}
        {...form.getInputProps('twitch')}
      />
      <TextInput
        label={t('columns.youtube')}
        placeholder={t('columns.youtube')}
        maxLength={MAX_CONTACT_LENGTH}
        {...form.getInputProps('youtube')}
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
