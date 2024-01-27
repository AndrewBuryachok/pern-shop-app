import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { City } from './city.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<City>;

export default function ViewCityModal({ data: city }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={city.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...city.user} />}
        iconWidth={48}
        value={city.user.nick}
        readOnly
      />
      <TextInput label={t('columns.city')} value={city.name} readOnly />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={city.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={city.video} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={city.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={city.x} readOnly />
      <TextInput label={t('columns.y')} value={city.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(city.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewCityAction = {
  open: (city: City) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.cities'),
      children: <ViewCityModal data={city} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
