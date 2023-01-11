import { Anchor, PasswordInput, Text, TextInput } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAppDispatch } from '../../app/hooks';
import { useLoginMutation, useRegisterMutation } from './auth.api';
import { AuthDto } from './auth.dto';
import { addCurrentUser } from './auth.slice';
import CustomForm from '../../common/components/CustomForm';
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '../../common/constants';

export default function AuthModal() {
  const [type, toggle] = useToggle(['Login', 'Register']);

  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: '',
      password: '',
    },
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleSubmit = async (dto: AuthDto) => {
    const data =
      type === 'Login'
        ? await login(dto).unwrap()
        : await register(dto).unwrap();
    dispatch(addCurrentUser(data));
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={type === 'Login' ? isLoginLoading : isRegisterLoading}
    >
      <TextInput
        label='Name'
        placeholder='Name'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('name')}
      />
      <PasswordInput
        label='Password'
        placeholder='Password'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('password')}
      />
      <Text size='xs'>
        {type === 'Login'
          ? 'Already have an account? '
          : "Don't have an account? "}
        {
          <Anchor
            component='button'
            type='button'
            onClick={() => toggle()}
            color='dimmed'
          >
            {type === 'Login' ? 'Register' : 'Login'}
          </Anchor>
        }
      </Text>
    </CustomForm>
  );
}

export const openAuthModal = () =>
  openModal({ title: 'Auth', children: <AuthModal /> });
