import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useTranslation } from 'react-i18next';
import { useMantineTheme } from '@mantine/core';
import { useDocumentTitle, useElementSize } from '@mantine/hooks';
import { useGetMainTownsQuery } from '../../features/towns/towns.api';
import { useGetMainShopsQuery } from '../../features/shops/shops.api';
import { useGetMainMarketsQuery } from '../../features/markets/markets.api';
import { useGetMainStoragesQuery } from '../../features/storages/storages.api';
import { useGetMainStationsQuery } from '../../features/stations/stations.api';
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

  const {
    data: towns,
    isFetching: isFetching1,
    refetch: refetch1,
  } = useGetMainTownsQuery({
    page: 0,
  });
  const {
    data: shops,
    isFetching: isFetching2,
    refetch: refetch2,
  } = useGetMainShopsQuery({
    page: 0,
  });
  const {
    data: markets,
    isFetching: isFetching3,
    refetch: refetch3,
  } = useGetMainMarketsQuery({
    page: 0,
  });
  const {
    data: storages,
    isFetching: isFetching4,
    refetch: refetch4,
  } = useGetMainStoragesQuery({
    page: 0,
  });
  const {
    data: stations,
    isFetching: isFetching5,
    refetch: refetch5,
  } = useGetMainStationsQuery({
    page: 0,
  });

  const isFetching =
    isFetching1 || isFetching2 || isFetching3 || isFetching4 || isFetching5;

  const refetch = () => {
    if (!isFetching) {
      refetch1();
      refetch2();
      refetch3();
      refetch4();
      refetch5();
    }
  };

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <TransformWrapper>
        <TransformComponent>
          <svg width={width} height={height}>
            {lines.map((line, index) => (
              <line
                key={index}
                {...line}
                stroke={theme.colors[isFetching ? 'gray' : colors[index]][7]}
                strokeWidth={2}
              ></line>
            ))}
            <circle
              cx='50%'
              cy='50%'
              r={8}
              fill={isFetching ? 'gray' : theme.colors.violet[7]}
              cursor={isFetching ? 'not-allowed' : 'pointer'}
              onClick={refetch}
            ></circle>
            {!isFetching &&
              [
                towns?.result.map((town) => ({
                  ...town,
                  type: 0,
                })),
                shops?.result.map((shop) => ({
                  ...shop,
                  type: 1,
                  user: shop.card.user,
                  card: shop.card,
                })),
                markets?.result.map((market) => ({
                  ...market,
                  type: 2,
                  user: market.card.user,
                  card: market.card,
                })),
                storages?.result.map((storage) => ({
                  ...storage,
                  type: 3,
                  user: storage.card.user,
                  card: storage.card,
                })),
                stations?.result.map((station) => ({
                  ...station,
                  type: 4,
                  user: station.card.user,
                  card: station.card,
                  price: station.price,
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
