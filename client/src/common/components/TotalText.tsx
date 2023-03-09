import SingleText from './SingleText';

type Props = {
  data: number;
};

export default function TotalText(props: Props) {
  return <SingleText text={`Total: ${props.data}`} />;
}
