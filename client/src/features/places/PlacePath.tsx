import { useMantineTheme } from '@mantine/core';
import { ExtPlace } from './place.model';
import { openPlaceModal } from './ViewPlaceModal';
import { parseCoordinates } from '../../common/utils';
import { Color, colors, MAX_COORDINATE_VALUE } from '../../common/constants';

type Props = {
  data: ExtPlace;
};

export default function PlacePath({ data: place }: Props) {
  const theme = useMantineTheme();

  const color = parseCoordinates(place);
  const vertical = [Color.GREEN, Color.BLUE].includes(color);
  const divider = MAX_COORDINATE_VALUE / 50;
  const x1 = 50 + (vertical ? 0 : place.x / divider) + '%';
  const x2 = 50 + place.x / divider + '%';
  const y1 = 50 + (vertical ? place.y / divider : 0) + '%';
  const y2 = 50 + place.y / divider + '%';
  const fill = theme.colors[colors[color - 1]][7];

  return (
    <>
      <line
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
        stroke={fill}
        strokeWidth='2'
      ></line>
      {!place.type ? (
        <circle
          cx={x2}
          cy={y2}
          r='4'
          fill={fill}
          cursor='pointer'
          onClick={() => openPlaceModal(place)}
        ></circle>
      ) : (
        <rect
          x={x2}
          y={y2}
          width='8'
          height='8'
          transform='translate(-4,-4)'
          fill={fill}
          cursor='pointer'
          onClick={() => openPlaceModal(place)}
        ></rect>
      )}
      <text
        x={x2}
        y={y2}
        fontSize='8'
        textAnchor='middle'
        transform='translate(0,-4)'
        fill={theme.colorScheme === 'dark' ? 'white' : 'black'}
      >
        {place.name}
      </text>
    </>
  );
}
