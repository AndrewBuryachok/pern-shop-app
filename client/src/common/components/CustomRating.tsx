import { Rating } from '@mantine/core';

type Props = {
  value?: number;
};

export default function CustomRating(props: Props) {
  return <Rating {...props} fractions={4} readOnly />;
}
