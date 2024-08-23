import { SmUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';
import LinkedAvatarWithoutIndicator from './LinkedAvatarWithoutIndicator';

type Props = SmUser;

export default function LinkedAvatar(props: Props) {
  return (
    <CustomIndicator {...props}>
      <LinkedAvatarWithoutIndicator {...props} />
    </CustomIndicator>
  );
}
