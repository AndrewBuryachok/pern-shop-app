import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetSingleUserQuery } from '../../features/users/users.api';
import UserProfile from '../../features/users/UserProfile';

export default function SingleUser() {
  useDocumentTitle('Single User | Shop');

  const { userId } = useParams();

  const { data: user } = useGetSingleUserQuery(+userId!);

  return <>{user && <UserProfile data={user} />}</>;
}
