import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace, PlaceType } from './place.model';
import { useSelectTownUsersQuery } from '../towns/towns.api';
import { useSelectShopGoodsQuery } from '../shops/shops.api';
import { useSelectMarketStallsQuery } from '../stalls/stalls.api';
import { useSelectStorageCellsQuery } from '../cells/cells.api';
import { useSelectStationBoxesQuery } from '../boxes/boxes.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import {
  parseCard,
  parseTime,
  viewContainers,
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

  const { data: townsUsers, ...townsUsersResponse } = useSelectTownUsersQuery(
    place.id,
    { skip: place.type !== PlaceType.TOWNS },
  );
  const { data: goods, ...goodsResponse } = useSelectShopGoodsQuery(place.id, {
    skip: place.type !== PlaceType.SHOPS,
  });
  const { data: stalls, ...stallsResponse } = useSelectMarketStallsQuery(
    place.id,
    { skip: place.type !== PlaceType.MARKETS },
  );
  const { data: cells, ...cellsResponse } = useSelectStorageCellsQuery(
    place.id,
    { skip: place.type !== PlaceType.STORAGES },
  );
  const { data: boxes, ...boxesResponse } = useSelectStationBoxesQuery(
    place.id,
    { skip: place.type !== PlaceType.STATIONS },
  );

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
      <TextInput label={t('columns.place')} value={place.name} readOnly />
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
          placeholder={`${t('components.total')}: ${townsUsers?.length || 0}`}
          rightSection={<RefetchAction {...townsUsersResponse} />}
          itemComponent={component}
          data={viewUsers(townsUsers || [])}
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
      {place.type === PlaceType.MARKETS && (
        <Select
          label={t('columns.stalls')}
          placeholder={`${t('components.total')}: ${stalls?.length || 0}`}
          rightSection={<RefetchAction {...stallsResponse} />}
          itemComponent={component}
          data={viewContainers(stalls || [])}
          limit={20}
          searchable
        />
      )}
      {place.type === PlaceType.STORAGES && (
        <Select
          label={t('columns.cells')}
          placeholder={`${t('components.total')}: ${cells?.length || 0}`}
          rightSection={<RefetchAction {...cellsResponse} />}
          itemComponent={component}
          data={viewContainers(cells || [])}
          limit={20}
          searchable
        />
      )}
      {place.type === PlaceType.STATIONS && (
        <Select
          label={t('columns.boxes')}
          placeholder={`${t('components.total')}: ${boxes?.length || 0}`}
          rightSection={<RefetchAction {...boxesResponse} />}
          itemComponent={component}
          data={viewContainers(boxes || [])}
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
