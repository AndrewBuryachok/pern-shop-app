import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateApplicationMutation } from './applications.api';
import { useSelectAllTownsQuery } from '../towns/towns.api';
import { TownIdDto } from '../towns/town.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import { selectTowns } from '../../common/utils';

export default function CreateApplicationModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      town: '',
    },
    transformValues: ({ town }) => ({
      townId: +town,
    }),
  });

  const { data: towns, ...townsResponse } = useSelectAllTownsQuery();

  const [createApplication, { isLoading }] = useCreateApplicationMutation();

  const handleSubmit = async (dto: TownIdDto) => {
    await createApplication(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.applications')}
    >
      <Select
        label={t('columns.town')}
        placeholder={t('columns.town')}
        rightSection={<RefetchAction {...townsResponse} />}
        itemComponent={PlacesItem}
        data={selectTowns(towns)}
        limit={20}
        searchable
        required
        readOnly={townsResponse.isFetching}
        {...form.getInputProps('town')}
      />
    </CustomForm>
  );
}

export const createApplicationButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.applications'),
      children: <CreateApplicationModal />,
    }),
};
