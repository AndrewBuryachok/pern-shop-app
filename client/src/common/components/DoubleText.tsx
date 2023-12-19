import SingleText from './SingleText';

type Props = {
  text: string;
  subtext: string;
  color?: number;
};

export default function DoubleText(props: Props) {
  return (
    <>
      <SingleText text={props.text} />
      <SingleText
        text={props.subtext}
        color={props.color ? props.color : undefined}
      />
    </>
  );
}
