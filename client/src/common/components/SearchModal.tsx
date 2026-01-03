import 'dayjs/locale/uk';
import { useEffect } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  CloseButton,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  Radio,
  Rating,
  Select,
  Slider,
  Textarea,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { closeAllModals, openModal } from '@mantine/modals';
import { ISearch } from '../interfaces';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import { useSelectUserCardsQuery } from '../../features/cards/cards.api';
import { useSelectAllTownsQuery } from '../../features/towns/towns.api';
import { useSelectAllShopsQuery } from '../../features/shops/shops.api';
import { useSelectAllStationsQuery } from '../../features/stations/stations.api';
import CustomForm from './CustomForm';
import RefetchAction from './RefetchAction';
import CustomAvatar from './CustomAvatar';
import ThingImage from './ThingImage';
import { UsersItem } from './UsersItem';
import { CardsItem } from './CardsItem';
import { ThingsItem } from './ThingsItem';
import { PlacesItem } from './PlacesItem';
import { RolesItem } from './RolesItem';
import { ColorsItem } from './ColorsItem';
import {
  scaleDate,
  scaleMaxPrice,
  scaleMaxSearch,
  scaleMaxSum,
  scaleMinPrice,
  scaleMinSearch,
  scaleMinSum,
  scalePrice,
  scaleSum,
  searchTypes,
  selectCards,
  selectItems,
  selectKits,
  selectRoles,
  selectShops,
  selectStations,
  selectStatuses,
  selectTowns,
  selectUsers,
  unscaleDate,
  unscaleMaxPrice,
  unscaleMaxSearch,
  unscaleMaxSum,
  unscaleMinPrice,
  unscaleMinSearch,
  unscaleMinSum,
} from '../../common/utils';
import {
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
} from '../constants';

type Props = {
  search: ISearch;
  isFetching: boolean;
};

export default function SearchModal(props: Props) {
  const [t, i18n] = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    initialValues: {
      ...props.search,
      minSum: unscaleMinSum(props.search.minSum),
      maxSum: unscaleMaxSum(props.search.maxSum),
      minAmount: unscaleMinSearch(props.search.minAmount),
      maxAmount: unscaleMaxSearch(props.search.maxAmount, MAX_AMOUNT_VALUE),
      minIntake: unscaleMinSearch(props.search.minIntake),
      maxIntake: unscaleMaxSearch(props.search.maxIntake, MAX_INTAKE_VALUE),
      minPrice: unscaleMinPrice(props.search.minPrice),
      maxPrice: unscaleMaxPrice(props.search.maxPrice),
      minDate: unscaleDate(props.search.minDate),
      maxDate: unscaleDate(props.search.maxDate),
    },
    transformValues: ({ modes, ...rest }) => ({
      ...rest,
      page: 0,
      minSum: scaleMinSum(rest.minSum),
      maxSum: scaleMaxSum(rest.maxSum),
      minAmount: scaleMinSearch(rest.minAmount),
      maxAmount: scaleMaxSearch(rest.maxAmount, MAX_AMOUNT_VALUE),
      minIntake: scaleMinSearch(rest.minIntake),
      maxIntake: scaleMaxSearch(rest.maxIntake, MAX_INTAKE_VALUE),
      minPrice: scaleMinPrice(rest.minPrice),
      maxPrice: scaleMaxPrice(rest.maxPrice),
      minDate: scaleDate(rest.minDate),
      maxDate: scaleDate(rest.maxDate),
    }),
  });

  useEffect(() => {
    if (form.values.id === undefined) {
      form.setFieldValue('id', null);
    }
  }, [form.values.id]);

  useEffect(() => {
    if (form.values.card !== undefined) {
      form.setFieldValue('card', null);
    }
  }, [form.values.user]);

  useEffect(() => {
    const roles = form.values.roles?.slice(0).sort();
    if (form.values.roles?.toString() !== roles?.toString()) {
      form.setFieldValue('roles', roles);
    }
  }, [form.values.roles]);

  useEffect(form.reset, []);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = useSelectUserCardsQuery(
    +(form.values.user || ''),
    { skip: props.search.card === undefined || !form.values.user },
  );
  const { data: towns, ...townsResponse } = useSelectAllTownsQuery(undefined, {
    skip: props.search.town === undefined,
  });
  const { data: shops, ...shopsResponse } = useSelectAllShopsQuery(undefined, {
    skip: props.search.shop === undefined,
  });
  const { data: stations, ...stationsResponse } = useSelectAllStationsQuery(
    undefined,
    { skip: props.search.station === undefined },
  );

  const user = users?.find((user) => user.id === +form.values.user!);

  const handleSubmit = (search: ISearch) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(search)) {
      if (value && (!Array.isArray(value) || value.length)) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    }
    setSearchParams(newSearchParams);
    closeAllModals();
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={props.isFetching}
      text={t('components.save')}
      isChanged={!form.isDirty()}
    >
      <NumberInput
        label={t('columns.id')}
        placeholder={t('columns.id')}
        min={1}
        {...form.getInputProps('id')}
      />
      <Select
        label={t('columns.user')}
        placeholder={`${t('components.total')}: ${users?.length || 0}`}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        limit={20}
        searchable
        allowDeselect
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
      {props.search.card !== undefined && (
        <Select
          label={t('columns.card')}
          placeholder={`${t('components.total')}: ${cards?.length || 0}`}
          rightSection={
            <RefetchAction {...cardsResponse} skip={!form.values.user} />
          }
          itemComponent={CardsItem}
          data={selectCards(cards)}
          limit={20}
          searchable
          allowDeselect
          readOnly={cardsResponse.isFetching}
          {...form.getInputProps('card')}
        />
      )}
      {props.search.modes && (
        <Radio.Group
          label={t('columns.mode')}
          spacing='md'
          {...form.getInputProps('mode')}
        >
          {props.search.modes.map((mode) => (
            <Radio key={mode} label={t(`columns.${mode}`)} value={mode} />
          ))}
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('mode', null)}
          />
        </Radio.Group>
      )}
      {props.search.roles && (
        <MultiSelect
          label={t('columns.roles')}
          placeholder={t('columns.roles')}
          itemComponent={RolesItem}
          data={selectRoles()}
          searchable
          {...form.getInputProps('roles')}
        />
      )}
      {props.search.town !== undefined && (
        <Select
          label={t('columns.town')}
          placeholder={`${t('components.total')}: ${towns?.length || 0}`}
          rightSection={<RefetchAction {...townsResponse} />}
          itemComponent={PlacesItem}
          data={selectTowns(towns)}
          limit={20}
          searchable
          allowDeselect
          readOnly={townsResponse.isFetching}
          {...form.getInputProps('town')}
        />
      )}
      {props.search.shop !== undefined && (
        <Select
          label={t('columns.shop')}
          placeholder={`${t('components.total')}: ${shops?.length || 0}`}
          rightSection={<RefetchAction {...shopsResponse} />}
          itemComponent={PlacesItem}
          data={selectShops(shops)}
          limit={20}
          searchable
          allowDeselect
          readOnly={shopsResponse.isFetching}
          {...form.getInputProps('shop')}
        />
      )}
      {props.search.station !== undefined && (
        <Select
          label={t('columns.station')}
          placeholder={`${t('components.total')}: ${stations?.length || 0}`}
          rightSection={<RefetchAction {...stationsResponse} />}
          itemComponent={PlacesItem}
          data={selectStations(stations)}
          limit={20}
          searchable
          allowDeselect
          readOnly={stationsResponse.isFetching}
          {...form.getInputProps('station')}
        />
      )}
      {props.search.item !== undefined && (
        <Select
          label={t('columns.item')}
          placeholder={t('columns.item')}
          icon={form.values.item && <ThingImage item={form.values.item} />}
          iconWidth={48}
          itemComponent={ThingsItem}
          data={selectItems()}
          limit={20}
          searchable
          allowDeselect
          {...form.getInputProps('item')}
        />
      )}
      {props.search.description !== undefined && (
        <Textarea
          label={t('columns.description')}
          placeholder={t('columns.description')}
          maxLength={MAX_DESCRIPTION_LENGTH}
          {...form.getInputProps('description')}
        />
      )}
      {props.search.type !== undefined && (
        <Select
          label={t('columns.type')}
          placeholder={t('columns.type')}
          itemComponent={ColorsItem}
          data={searchTypes()}
          searchable
          allowDeselect
          {...form.getInputProps('type')}
        />
      )}
      {(props.search.minSum && props.search.maxSum) !== undefined && (
        <Input.Wrapper label={t('columns.sum')}>
          <Slider
            min={1}
            max={2000}
            scale={scaleSum}
            marks={[{ value: 1000 }]}
            inverted
            {...form.getInputProps('minSum')}
          />
          <Slider
            min={1}
            max={2000}
            scale={scaleSum}
            marks={[{ value: 1000 }]}
            {...form.getInputProps('maxSum')}
          />
        </Input.Wrapper>
      )}
      {(props.search.minAmount && props.search.maxAmount) !== undefined && (
        <Input.Wrapper label={t('columns.amount')}>
          <Slider
            min={1}
            max={MAX_AMOUNT_VALUE}
            marks={[{ value: 1 }, { value: MAX_AMOUNT_VALUE }]}
            inverted
            {...form.getInputProps('minAmount')}
          />
          <Slider
            min={1}
            max={MAX_AMOUNT_VALUE}
            marks={[{ value: 1 }, { value: MAX_AMOUNT_VALUE }]}
            {...form.getInputProps('maxAmount')}
          />
        </Input.Wrapper>
      )}
      {(props.search.minIntake && props.search.maxIntake) !== undefined && (
        <Input.Wrapper label={t('columns.intake')}>
          <Slider
            min={1}
            max={MAX_INTAKE_VALUE}
            marks={[{ value: 1 }, { value: MAX_INTAKE_VALUE }]}
            inverted
            {...form.getInputProps('minIntake')}
          />
          <Slider
            min={1}
            max={MAX_INTAKE_VALUE}
            marks={[{ value: 1 }, { value: MAX_INTAKE_VALUE }]}
            {...form.getInputProps('maxIntake')}
          />
        </Input.Wrapper>
      )}
      {props.search.kit !== undefined && (
        <Select
          label={t('columns.kit')}
          placeholder={t('columns.kit')}
          data={selectKits()}
          searchable
          allowDeselect
          {...form.getInputProps('kit')}
        />
      )}
      {(props.search.minPrice && props.search.maxPrice) !== undefined && (
        <Input.Wrapper label={t('columns.price')}>
          <Slider
            min={1}
            max={200}
            scale={scalePrice}
            marks={[{ value: 100 }]}
            inverted
            {...form.getInputProps('minPrice')}
          />
          <Slider
            min={1}
            max={200}
            scale={scalePrice}
            marks={[{ value: 100 }]}
            {...form.getInputProps('maxPrice')}
          />
        </Input.Wrapper>
      )}
      {props.search.status !== undefined && (
        <Select
          label={t('columns.status')}
          placeholder={t('columns.status')}
          itemComponent={ColorsItem}
          data={selectStatuses()}
          searchable
          allowDeselect
          {...form.getInputProps('status')}
        />
      )}
      {props.search.minDate !== undefined && (
        <DatePicker
          label={t('columns.created') + ' ' + t('columns.after')}
          placeholder={t('columns.created') + ' ' + t('columns.after')}
          locale={i18n.language}
          {...form.getInputProps('minDate')}
        />
      )}
      {props.search.maxDate !== undefined && (
        <DatePicker
          label={t('columns.created') + ' ' + t('columns.before')}
          placeholder={t('columns.created') + ' ' + t('columns.before')}
          locale={i18n.language}
          {...form.getInputProps('maxDate')}
        />
      )}
      {props.search.completed !== undefined && (
        <Radio.Group
          label={t('columns.completed')}
          spacing='md'
          {...form.getInputProps('completed')}
        >
          {['completed', 'incompleted'].map((label, index) => (
            <Radio
              key={label}
              label={t(`columns.${label}`)}
              value={`${1 - index * 2}`}
            />
          ))}
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('completed', null)}
          />
        </Radio.Group>
      )}
      {props.search.rate !== undefined && (
        <Input.Wrapper label={t('columns.rate')}>
          <Group spacing={8}>
            <Rating {...form.getInputProps('rate')} />
            <CloseButton
              size={24}
              iconSize={16}
              onClick={() => form.setFieldValue('rate', null)}
            />
          </Group>
        </Input.Wrapper>
      )}
    </CustomForm>
  );
}

export const openSearchModal = (props: Props) =>
  openModal({
    title: t('components.search'),
    children: <SearchModal {...props} />,
  });
