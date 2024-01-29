import { forwardRef } from 'react';
import RolesBadge from './RolesBadge';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  role: string;
}

export const RolesItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => (
    <div ref={ref} {...props}>
      <RolesBadge roles={[+props.role]} />
    </div>
  ),
);
