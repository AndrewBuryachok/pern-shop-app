import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtPlace } from './place.model';
import { useSelectTownUsersQuery } from '../towns/towns.api';
import { useSelectFarmUsersQuery } from '../farms/farms.api';
import { useSelectShopGoodsQuery } from '../shops/shops.api';
import { useSelectMarketStoresQuery } from '../stores/stores.api';
import { useSelectStorageCellsQuery } from '../cells/cells.api';
import { useSelectStationDrawersQuery } from '../drawers/drawers.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
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
    place.type === 0 || place.type === 1
      ? UsersItem
      : place.type === 2
      ? ThingsItemWithAmount
      : undefined;

  const { data: townsUsers, ...townsUsersResponse } = useSelectTownUsersQuery(
    place.id,
    { skip: place.type !== 0 },
  );
  const { data: farmsUsers, ...farmsUsersResponse } = useSelectFarmUsersQuery(
    place.id,
    { skip: place.type !== 1 },
  );
  const { data: goods, ...goodsResponse } = useSelectShopGoodsQuery(place.id, {
    skip: place.type !== 2,
  });
  const { data: stores, ...storesResponse } = useSelectMarketStoresQuery(
    place.id,
    { skip: place.type !== 3 },
  );
  const { data: cells, ...cellsResponse } = useSelectStorageCellsQuery(
    place.id,
    { skip: place.type !== 4 },
  );
  const { data: drawers, ...drawersResponse } = useSelectStationDrawersQuery(
    place.id,
    { skip: place.type !== 5 },
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
      {place.image && (
        <Input.Wrapper label={t('columns.image')}>
          <CustomImage image={place.image} />
        </Input.Wrapper>
      )}
      {place.video && (
        <Input.Wrapper label={t('columns.video')}>
          <CustomVideo video={place.video} />
        </Input.Wrapper>
      )}
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
      {place.type === 0 && (
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
      {place.type === 1 && (
        <Select
          label={t('columns.users')}
          placeholder={`${t('components.total')}: ${farmsUsers?.length || 0}`}
          rightSection={<RefetchAction {...farmsUsersResponse} />}
          itemComponent={component}
          data={viewUsers(farmsUsers || [])}
          limit={20}
          searchable
        />
      )}
      {place.type === 2 && (
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
      {place.type === 3 && (
        <Select
          label={t('columns.stores')}
          placeholder={`${t('components.total')}: ${stores?.length || 0}`}
          rightSection={<RefetchAction {...storesResponse} />}
          itemComponent={component}
          data={viewContainers(stores || [])}
          limit={20}
          searchable
        />
      )}
      {place.type === 4 && (
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
      {place.type === 5 && (
        <Select
          label={t('columns.drawers')}
          placeholder={`${t('components.total')}: ${drawers?.length || 0}`}
          rightSection={<RefetchAction {...drawersResponse} />}
          itemComponent={component}
          data={viewContainers(drawers || [])}
          limit={20}
          searchable
        />
      )}
    </Stack>
  );
}

export const openPlaceModal = (place: ExtPlace) =>
  openModal({
    title:
      t('actions.view') +
      ' ' +
      t(
        `modals.${
          ['towns', 'farms', 'shops', 'markets', 'storages', 'stations'][
            place.type
          ]
        }`,
      ),
    children: <PlaceModal data={place} />,
  });
