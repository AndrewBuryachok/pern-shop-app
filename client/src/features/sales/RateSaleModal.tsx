import {
  CloseButton,
  Group,
  Input,
  Rating,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Sale } from './sale.model';
import { useRateSaleMutation } from './sales.api';
import { RateSaleDto } from './sale.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseSaleAmount } from '../../common/utils';
import { Color, items } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Sale>;

export default function RateSaleModal({ data: sale }: Props) {
  const form = useForm({
    initialValues: {
      saleId: sale.id,
      rate: sale.rate || 0,
    },
  });

  const [rateSale, { isLoading }] = useRateSaleMutation();

  const handleSubmit = async (dto: RateSaleDto) => {
    await rateSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Rate sale'}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...sale.product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(sale.product.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...sale.product} />}
        iconWidth={48}
        value={items[sale.product.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={sale.product.description} disabled />
      <TextInput label='Amount' value={parseSaleAmount(sale)} disabled />
      <TextInput
        label='Sum'
        value={`${sale.amount * sale.product.price}$`}
        disabled
      />
      <Input.Wrapper label='Rate' required>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateSaleAction = {
  open: (sale: Sale) =>
    openModal({
      title: 'Rate Sale',
      children: <RateSaleModal data={sale} />,
    }),
  disable: (sale: Sale) => {
    const user = getCurrentUser()!;
    return sale.card.user.id !== user.id;
  },
  color: Color.YELLOW,
};
