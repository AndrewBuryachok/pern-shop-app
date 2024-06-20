import { SmUser } from '../../features/users/user.model';
import CustomIndicator from './CustomIndicator';
import CustomAvatarWithoutIndicator from './CustomAvatarWithoutIndicator';

type Props = SmUser;

export default function CustomAvatar(props: Props) {
  return (
    <CustomIndicator {...props}>
      <CustomAvatarWithoutIndicator {...props} />
    </CustomIndicator>
  );
}
