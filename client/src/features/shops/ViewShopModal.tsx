import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function ViewShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={shop.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shop.user} />}
        iconWidth={48}
        value={shop.user.nick}
        readOnly
      />
      <TextInput label={t('columns.shop')} value={shop.name} readOnly />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={shop.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={shop.video} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={shop.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={shop.x} readOnly />
      <TextInput label={t('columns.y')} value={shop.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(shop.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.shops'),
      children: <ViewShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
