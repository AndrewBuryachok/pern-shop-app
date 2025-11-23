import { Carousel } from '@mantine/carousel';
import CustomImage from './CustomImage';

type Props = {
  images: string[];
};

export default function CustomCarousel(props: Props) {
  return (
    <Carousel withIndicators>
      {props.images.map((image, index) => (
        <Carousel.Slide key={image}>
          <CustomImage image={image} isFirst={!index} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
