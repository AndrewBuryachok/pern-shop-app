import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../constants';
import { isUserNotHasRole } from '../utils';

type Props = {
  children: ReactNode;
  role?: Role;
};

export default function Protected({ children, role }: Props) {
  if (isUserNotHasRole(role)) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}
