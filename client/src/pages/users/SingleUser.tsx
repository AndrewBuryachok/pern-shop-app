import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetSingleUserQuery } from '../../features/users/users.api';
import UserProfile from '../../features/users/UserProfile';
import CustomLoader from '../../common/components/CustomLoader';

export default function SingleUser() {
  const [t] = useTranslation();

  const { userId } = useParams();

  const { data: user } = useGetSingleUserQuery(+userId!);

  useDocumentTitle(t('navbar.user') + ' ' + (user?.nick || ''));

  return user ? <UserProfile data={user} /> : <CustomLoader />;
}
