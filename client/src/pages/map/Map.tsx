import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useTranslation } from 'react-i18next';
import { useMantineTheme } from '@mantine/core';
import { useDocumentTitle, useElementSize } from '@mantine/hooks';
import { useGetMainCitiesQuery } from '../../features/cities/cities.api';
import { useGetMainShopsQuery } from '../../features/shops/shops.api';
import { useGetMainMarketsQuery } from '../../features/markets/markets.api';
import { useGetMainStoragesQuery } from '../../features/storages/storages.api';
import PlacePath from '../../features/places/PlacePath';
import { colors } from '../../common/constants';

export default function Map() {
  const { ref, width, height } = useElementSize();

  const [t] = useTranslation();

  useDocumentTitle(t('navbar.map'));

  const theme = useMantineTheme();

  const lines = [
    { x1: '50%', x2: '100%', y1: '50%', y2: '50%' },
    { x1: '50%', x2: '0%', y1: '50%', y2: '50%' },
    { x1: '50%', x2: '50%', y1: '50%', y2: '100%' },
    { x1: '50%', x2: '50%', y1: '50%', y2: '0%' },
  ];

  const { data: cities, isLoading: isLoading1 } = useGetMainCitiesQuery({
    page: 0,
  });
  const { data: shops, isLoading: isLoading2 } = useGetMainShopsQuery({
    page: 0,
  });
  const { data: markets, isLoading: isLoading3 } = useGetMainMarketsQuery({
    page: 0,
  });
  const { data: storages, isLoading: isLoading4 } = useGetMainStoragesQuery({
    page: 0,
  });

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <TransformWrapper>
        <TransformComponent>
          <svg width={width} height={height}>
            {lines.map((line, index) => (
              <line
                key={index}
                {...line}
                stroke={theme.colors[isLoading ? 'gray' : colors[index]][7]}
                strokeWidth={2}
              ></line>
            ))}
            <circle
              cx='50%'
              cy='50%'
              r={8}
              fill={theme.colors.violet[7]}
            ></circle>
            {!isLoading &&
              [
                cities?.result.map((city) => ({
                  ...city,
                  type: 0,
                  owner: city.user,
                  data: city.users,
                })),
                shops?.result.map((shop) => ({
                  ...shop,
                  type: 1,
                  owner: shop.user,
                  data: shop.goods,
                })),
                markets?.result.map((market) => ({
                  ...market,
                  type: 2,
                  owner: market.card.user,
                  card: market.card,
                  data: market.stores,
                })),
                storages?.result.map((storage) => ({
                  ...storage,
                  type: 3,
                  owner: storage.card.user,
                  card: storage.card,
                  data: storage.cells,
                })),
              ].map((allPlaces) =>
                allPlaces?.map((place) => (
                  <PlacePath key={place.id} data={place} />
                )),
              )}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
