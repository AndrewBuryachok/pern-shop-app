import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetLogsQuery } from '../../features/logger/logger.api';
import { parseTime } from '../../common/utils';

export default function Logger() {
  const { data: logs } = useGetLogsQuery();

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={
          logs &&
          [...logs].reverse().map((log) => ({
            ...log,
            createdAt: parseTime(log.createdAt),
          }))
        }
        margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
      >
        <Line type='monotone' dataKey='count' />
        <CartesianGrid strokeDasharray='5 5' />
        <XAxis dataKey='createdAt' />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
