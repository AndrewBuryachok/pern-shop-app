import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  FileInput,
  Group,
  Input,
  Select,
  Textarea,
} from '@mantine/core';
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
import CustomCarousel from '../../common/components/CustomCarousel';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers, uploadImage } from '../../common/utils';
import { MAX_IMAGES_LENGTH, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = { hasRole: boolean };

export default function CreateArticleModal({ hasRole }: Props) {
  const [t] = useTranslation();

  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      user: '',
      text: '',
      images: [] as string[],
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  useEffect(() => {
    if (image) {
      uploadImage(image).then((link) =>
        link
          ? form.setFieldValue('images', [...form.values.images, link])
          : setImageError(t('errors.failed_upload_image')),
      );
    } else {
      setImageError(null);
    }
  }, [image]);

  useEffect(() => {
    setImage(null);
  }, [form.values.images]);

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
        description={
          form.values.text && form.values.text.length + '/' + MAX_TEXT_LENGTH
        }
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      {!!form.values.images.length && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomCarousel images={form.values.images} />
        </Input.Wrapper>
      )}
      {!!form.values.images.length && (
        <Group spacing={8} position='center'>
          {form.values.images.map((image) => (
            <CloseButton
              key={image}
              size={24}
              iconSize={16}
              onClick={() =>
                form.setFieldValue(
                  'images',
                  form.values.images.filter((i) => i !== image),
                )
              }
            />
          ))}
        </Group>
      )}
      {form.values.images.length < MAX_IMAGES_LENGTH && (
        <FileInput
          label={t('columns.image')}
          placeholder={t('columns.image')}
          icon={<IconPhoto size={16} />}
          value={image}
          onChange={setImage}
          error={imageError}
          accept='image/jpeg,image/jpg,image/gif,image/png'
        />
      )}
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
