import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace, PlaceType } from './place.model';
import { useSelectTownUsersQuery } from '../towns/towns.api';
import { useSelectShopGoodsQuery } from '../shops/shops.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import {
  parseCard,
  parseTime,
  viewThings,
  viewUsers,
} from '../../common/utils';

type Props = IModal<ExtPlace>;

export default function PlaceModal({ data: place }: Props) {
  const [t] = useTranslation();

  const component =
    place.type === PlaceType.TOWNS
      ? UsersItem
      : place.type === PlaceType.SHOPS
      ? ThingsItemWithAmount
      : undefined;

  const { data: users, ...usersResponse } = useSelectTownUsersQuery(place.id, {
    skip: place.type !== PlaceType.TOWNS,
  });
  const { data: goods, ...goodsResponse } = useSelectShopGoodsQuery(place.id, {
    skip: place.type !== PlaceType.SHOPS,
  });

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={place.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...place.user} />}
        iconWidth={48}
        value={place.card ? parseCard(place.card) : place.user.nick}
        readOnly
      />
      <TextInput label={t('columns.name')} value={place.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={place.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={place.x} readOnly />
      <TextInput label={t('columns.y')} value={place.y} readOnly />
      {place.price && (
        <TextInput
          label={t('columns.price')}
          value={`${place.price} ${t('constants.currency')}`}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.created')}
        value={parseTime(place.createdAt)}
        readOnly
      />
      {place.type === PlaceType.TOWNS && (
        <Select
          label={t('columns.users')}
          placeholder={`${t('components.total')}: ${users?.length || 0}`}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={component}
          data={viewUsers(users || [])}
          limit={20}
          searchable
        />
      )}
      {place.type === PlaceType.SHOPS && (
        <Select
          label={t('columns.goods')}
          placeholder={`${t('components.total')}: ${goods?.length || 0}`}
          rightSection={<RefetchAction {...goodsResponse} />}
          itemComponent={component}
          data={viewThings(goods || [])}
          limit={20}
          searchable
        />
      )}
    </Stack>
  );
}

export const openPlaceModal = (place: ExtPlace) =>
  openModal({
    title: t('actions.view') + ' ' + t(`modals.${place.type}`),
    children: <PlaceModal data={place} />,
  });
