import { useMantineTheme } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetMainCitiesQuery } from '../../features/cities/cities.api';
import { useGetMainShopsQuery } from '../../features/shops/shops.api';
import { useGetMainMarketsQuery } from '../../features/markets/markets.api';
import { useGetMainStoragesQuery } from '../../features/storages/storages.api';
import PlacePath from '../../features/places/PlacePath';
import { viewContainers, viewThings, viewUsers } from '../../common/utils';
import { colors } from '../../common/constants';

export default function Map() {
  useDocumentTitle('Map | Shop');

  const theme = useMantineTheme();

  const lines = [
    { x1: '50%', x2: '50%', y1: '50%', y2: '0%' },
    { x1: '50%', x2: '50%', y1: '50%', y2: '100%' },
    { x1: '50%', x2: '100%', y1: '50%', y2: '50%' },
    { x1: '50%', x2: '0%', y1: '50%', y2: '50%' },
  ];

  const { data: cities, isFetching: isFetching1 } = useGetMainCitiesQuery({});
  const { data: shops, isFetching: isFetching2 } = useGetMainShopsQuery({});
  const { data: markets, isFetching: isFetching3 } = useGetMainMarketsQuery({});
  const { data: storages, isFetching: isFetching4 } = useGetMainStoragesQuery(
    {},
  );

  const isFetching = isFetching1 || isFetching2 || isFetching3 || isFetching4;

  return (
    <svg width='100%' height='100%'>
      {lines.map((line, index) => (
        <line
          key={index}
          {...line}
          stroke={theme.colors[isFetching ? 'gray' : colors[index]][7]}
          strokeWidth='2'
        ></line>
      ))}
      <circle cx='50%' cy='50%' r='8' fill={theme.colors.violet[7]}></circle>
      {!isFetching &&
        [
          cities?.result.map((city) => ({
            ...city,
            type: 0,
            owner: city.user,
            data: viewUsers(city.users),
          })),
          shops?.result.map((shop) => ({
            ...shop,
            type: 1,
            owner: shop.user,
            data: viewThings(shop.goods),
          })),
          markets?.result.map((market) => ({
            ...market,
            type: 2,
            owner: market.card.user,
            card: market.card,
            data: viewContainers(market.stores),
          })),
          storages?.result.map((storage) => ({
            ...storage,
            type: 3,
            owner: storage.card.user,
            card: storage.card,
            data: viewContainers(storage.cells),
          })),
        ].map((allPlaces) =>
          allPlaces?.map((place) => <PlacePath key={place.id} data={place} />),
        )}
    </svg>
  );
}
