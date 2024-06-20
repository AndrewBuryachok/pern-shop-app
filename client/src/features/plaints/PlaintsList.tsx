import { ITableWithActions } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import CustomList from '../../common/components/CustomList';
import PlaintPaper from './PlaintPaper';

type Props = ITableWithActions<Plaint>;

export default function PlaintsList({ actions = [], ...props }: Props) {
  return (
    <CustomList {...props}>
      {props.data?.result.map((plaint) => (
        <PlaintPaper key={plaint.id} plaint={plaint} actions={actions} />
      ))}
    </CustomList>
  );
}
