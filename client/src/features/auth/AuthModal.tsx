import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Anchor, PasswordInput, Text, TextInput } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAppDispatch } from '../../app/hooks';
import { useLoginMutation, useRegisterMutation } from './auth.api';
import { AuthDto } from './auth.dto';
import { addCurrentUser } from './auth.slice';
import { subscribe } from '../mqtt/mqtt.slice';
import CustomForm from '../../common/components/CustomForm';
import {
  MAX_NICK_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NICK_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../common/constants';

export default function AuthModal() {
  const [t] = useTranslation();

  const [type, toggle] = useToggle(['login', 'register']);

  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleSubmit = async (dto: AuthDto) => {
    const data =
      type === 'login'
        ? await login(dto).unwrap()
        : await register(dto).unwrap();
    dispatch(addCurrentUser(data));
    dispatch(subscribe(data.id));
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={type === 'login' ? isLoginLoading : isRegisterLoading}
    >
      <TextInput
        label={t('columns.nick')}
        placeholder={t('columns.nick')}
        required
        minLength={MIN_NICK_LENGTH}
        maxLength={MAX_NICK_LENGTH}
        {...form.getInputProps('nick')}
      />
      <PasswordInput
        label={t('columns.password')}
        placeholder={t('columns.password')}
        required
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={MAX_PASSWORD_LENGTH}
        {...form.getInputProps('password')}
      />
      <Text size='xs'>
        {t('modals.' + type + '.text')}
        <Anchor
          component='button'
          type='button'
          onClick={() => toggle()}
          color='dimmed'
        >
          {t('modals.' + type + '.anchor')}
        </Anchor>
      </Text>
    </CustomForm>
  );
}

export const openAuthModal = () =>
  openModal({ title: t('modals.auth'), children: <AuthModal /> });
