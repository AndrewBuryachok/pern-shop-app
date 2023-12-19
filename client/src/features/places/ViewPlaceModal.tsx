import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace } from './place.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItem } from '../../common/components/ThingsItem';
import { parseCard } from '../../common/utils';

type Props = IModal<ExtPlace>;

export default function PlaceModal({ data: place }: Props) {
  const [t] = useTranslation();

  const label = ['users', 'goods', 'stores', 'cells'][place.type];
  const component =
    label === 'users' ? UsersItem : label === 'goods' ? ThingsItem : undefined;

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={place.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...place.owner} />}
        iconWidth={48}
        value={place.card ? parseCard(place.card) : place.owner.nick}
        disabled
      />
      <TextInput label={t('columns.place')} value={place.name} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage {...place} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={place.description || '-'}
        disabled
      />
      <TextInput label={t('columns.x')} value={place.x} disabled />
      <TextInput label={t('columns.y')} value={place.y} disabled />
      {place.price && (
        <TextInput
          label={t('columns.price')}
          value={`${place.price}$`}
          disabled
        />
      )}
      <Select
        label={t('columns.' + label)}
        placeholder={`${t('components.total')}: ${place.data.length}`}
        itemComponent={component}
        data={place.data}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const openPlaceModal = (place: ExtPlace) =>
  openModal({
    title:
      t('actions.view') +
      ' ' +
      t('modals.' + ['city', 'shop', 'market', 'storage'][place.type]),
    children: <PlaceModal data={place} />,
  });
