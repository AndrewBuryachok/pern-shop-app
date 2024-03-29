import SingleText from './SingleText';

type Props = {
  price: number;
};

export default function PriceText(props: Props) {
  return <SingleText text={`${props.price}$`} />;
}
