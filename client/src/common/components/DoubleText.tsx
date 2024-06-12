import SingleText from './SingleText';

type Props = {
  text: string;
  subtext: string;
  color?: number;
  bold?: boolean;
  dimmed?: boolean;
};

export default function DoubleText(props: Props) {
  return (
    <>
      <SingleText text={props.text} bold={props.bold} />
      <SingleText
        text={props.subtext}
        color={props.color}
        dimmed={props.dimmed}
      />
    </>
  );
}
