import { NativeSelect } from '@mantine/core';

type Props = {
  label: string;
  data: (string | { value: string; label: string })[];
};

export default function CustomSelect(props: Props) {
  return <NativeSelect aria-label={props.label} data={props.data} />;
}
