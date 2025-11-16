import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IconPhoto } from '@tabler/icons';
import {
  useCreateMyPollMutation,
  useCreateUserPollMutation,
} from './polls.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { UsersItem } from '../../common/components/UsersItem';
import { selectMarks, selectUsers, uploadImage } from '../../common/utils';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreatePollModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      user: '',
      text: '',
      mark: '',
      image: '',
    },
    transformValues: ({ user, mark, ...rest }) => ({
      ...rest,
      mark: +mark,
      userId: +user,
    }),
  });

  useEffect(() => {
    if (image) {
      uploadImage(image).then((link) =>
        link
          ? form.setFieldValue('image1', link)
          : setImageError(t('errors.failed_upload_image')),
      );
    } else {
      setImageError(null);
    }
  }, [image]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });

  const user = users?.find((user) => user.id === +form.values.user);

  const [createPoll, { isLoading }] = hasRole
    ? useCreateUserPollMutation()
    : useCreateMyPollMutation();

  const handleSubmit = async (dto: ExtCreatePollDto) => {
    await createPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.polls')}
    >
      {hasRole && (
        <Select
          label={t('columns.user')}
          placeholder={t('columns.user')}
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Select
        label={t('columns.mark')}
        placeholder={t('columns.mark')}
        data={selectMarks()}
        searchable
        required
        {...form.getInputProps('mark')}
      />
      <FileInput
        label={t('columns.image')}
        placeholder={t('columns.image')}
        icon={<IconPhoto size={16} />}
        value={image}
        onChange={setImage}
        error={imageError}
        clearable
        accept='image/jpeg,image/jpg,image/gif,image/png'
      />
      {form.values.image && <CustomImage image={form.values.image} />}
    </CustomForm>
  );
}

export const createPollFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.polls'),
      children: <CreatePollModal hasRole={hasRole} />,
    }),
});

export const createMyPollButton = createPollFactory(false);

export const createUserPollButton = createPollFactory(true);
