import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Checkbox, useMantineTheme } from '@mantine/core';
import { useDocumentTitle, useElementSize } from '@mantine/hooks';
import { ExtPlace, PlaceType } from '../../features/places/place.model';
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

  const allPlaces = Object.values(PlaceType);

  const [places, setPlaces] = useState(allPlaces);

  const {
    data: data1,
    isFetching: isFetching1,
    refetch: refetch1,
  } = useGetMainTownsQuery({
    page: 0,
  });
  const {
    data: data2,
    isFetching: isFetching2,
    refetch: refetch2,
  } = useGetMainShopsQuery({
    page: 0,
  });
  const {
    data: data3,
    isFetching: isFetching3,
    refetch: refetch3,
  } = useGetMainMarketsQuery({
    page: 0,
  });
  const {
    data: data4,
    isFetching: isFetching4,
    refetch: refetch4,
  } = useGetMainStoragesQuery({
    page: 0,
  });
  const {
    data: data5,
    isFetching: isFetching5,
    refetch: refetch5,
  } = useGetMainStationsQuery({
    page: 0,
  });

  const isFetching =
    isFetching1 || isFetching2 || isFetching3 || isFetching4 || isFetching5;

  const refetch = () => {
    if (!isFetching) {
      if (places.includes(PlaceType.TOWNS)) {
        refetch1();
      }
      if (places.includes(PlaceType.SHOPS)) {
        refetch2();
      }
      if (places.includes(PlaceType.MARKETS)) {
        refetch3();
      }
      if (places.includes(PlaceType.STORAGES)) {
        refetch4();
      }
      if (places.includes(PlaceType.STATIONS)) {
        refetch5();
      }
    }
  };

  const towns = data1?.result.map(
    (p) => ({ ...p, type: PlaceType.TOWNS } as ExtPlace),
  );
  const shops = data2?.result.map(
    (p) => ({ ...p, user: p.card.user, type: PlaceType.SHOPS } as ExtPlace),
  );
  const markets = data3?.result.map(
    (p) => ({ ...p, user: p.card.user, type: PlaceType.MARKETS } as ExtPlace),
  );
  const storages = data4?.result.map(
    (p) => ({ ...p, user: p.card.user, type: PlaceType.STORAGES } as ExtPlace),
  );
  const stations = data5?.result.map(
    (p) => ({ ...p, user: p.card.user, type: PlaceType.STATIONS } as ExtPlace),
  );

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <TransformWrapper>
        <div style={{ position: 'absolute', zIndex: 1 }}>
          <Checkbox.Group
            value={places}
            onChange={(places) => setPlaces(places as PlaceType[])}
            orientation='vertical'
            offset={0}
            spacing={0}
          >
            {allPlaces.map((place) => (
              <Checkbox
                key={place}
                value={place}
                label={t(`navbar.${place}`)}
              />
            ))}
          </Checkbox.Group>
        </div>
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
              [towns, shops, markets, storages, stations].map((allPlaces) =>
                allPlaces
                  ?.filter((place) => places.includes(place.type))
                  .map((place) => <PlacePath key={place.id} data={place} />),
              )}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
