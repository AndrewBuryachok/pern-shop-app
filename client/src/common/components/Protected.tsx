import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthModal from '../../features/auth/AuthModal';
import { isUserNotHasRole } from '../utils';
import { Role } from '../constants';

type Props = {
  children: ReactNode;
  roles?: Role[];
};

export default function Protected(props: Props) {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const [opened, { close }] = useDisclosure(true);

  if (isUserNotHasRole(props.roles)) {
    if (!props.roles) {
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
