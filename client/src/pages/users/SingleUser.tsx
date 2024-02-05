import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetSingleUserQuery } from '../../features/users/users.api';
import UserProfile from '../../features/users/UserProfile';
import CustomLoader from '../../common/components/CustomLoader';

export default function SingleUser() {
  const [t] = useTranslation();

  const { nick } = useParams();

  const { data: user } = useGetSingleUserQuery(nick!);

  useDocumentTitle(t('navbar.user') + ' ' + nick);

  return user ? <UserProfile data={user} /> : <CustomLoader />;
}
