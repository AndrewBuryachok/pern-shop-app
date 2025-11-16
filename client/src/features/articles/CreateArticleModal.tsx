import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IconPhoto } from '@tabler/icons';
import {
  useCreateMyArticleMutation,
  useCreateUserArticleMutation,
} from './articles.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { ExtCreateArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers, uploadImage } from '../../common/utils';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateArticleModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      user: '',
      text: '',
      image1: '',
      image2: '',
      image3: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
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

  const [createArticle, { isLoading }] = hasRole
    ? useCreateUserArticleMutation()
    : useCreateMyArticleMutation();

  const handleSubmit = async (dto: ExtCreateArticleDto) => {
    await createArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.articles')}
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
      {form.values.image1 && <CustomImage image={form.values.image1} />}
    </CustomForm>
  );
}

export const createArticleFactory = (hasRole: boolean) => ({
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.articles'),
      children: <CreateArticleModal hasRole={hasRole} />,
    }),
});

export const createMyArticleButton = createArticleFactory(false);

export const createUserArticleButton = createArticleFactory(true);
