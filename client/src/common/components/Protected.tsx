import { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from '../../features/auth/AuthModal';
import { isUserNotHasRole } from '../utils';
import { Role } from '../constants';

type Props = {
  children: ReactNode;
  role?: Role;
};

export default function Protected(props: Props) {
  const navigate = useNavigate();

  const [t] = useTranslation();

  const [opened, { close }] = useDisclosure(true);

  if (isUserNotHasRole(props.role)) {
    if (!props.role) {
      return (
        <Modal
          title={t('modals.auth')}
          opened={opened}
          onClose={() => {
            close();
            navigate('/', { replace: true });
          }}
        >
          <AuthModal />
        </Modal>
      );
    }

    return <Navigate to='/' replace />;
  }

  return <>{props.children}</>;
}
