import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Town } from './town.model';
import { useDeleteTownMutation } from './towns.api';
import { TownIdDto } from './town.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Town>;

export default function DeleteTownModal({ data: town }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      townId: town.id,
    },
  });

  const [deleteTown, { isLoading }] = useDeleteTownMutation();

  const handleSubmit = async (dto: TownIdDto) => {
    await deleteTown(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.towns')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...town.user} />}
        iconWidth={48}
        value={town.user.nick}
        readOnly
      />
      <TextInput label={t('columns.town')} value={town.name} readOnly />
      {town.image && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={town.image} />
        </Input.Wrapper>
      )}
      {town.video && (
        <Input.Wrapper label={t('columns.video')}>
          <CustomVideo video={town.video} />
        </Input.Wrapper>
      )}
      <Textarea
        label={t('columns.description')}
        value={town.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={town.x} readOnly />
      <TextInput label={t('columns.y')} value={town.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(town.createdAt)}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteTownFactory = (hasRole: boolean) => ({
  open: (town: Town) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.towns'),
      children: <DeleteTownModal data={town} />,
    }),
  disable: () => false,
  color: Color.RED,
});

export const deleteMyTownAction = deleteTownFactory(false);

export const deleteUserTownAction = deleteTownFactory(true);
