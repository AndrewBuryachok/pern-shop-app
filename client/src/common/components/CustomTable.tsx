import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Paper, ScrollArea, Skeleton, Stack, Table } from '@mantine/core';
import { IPage } from '../interfaces';
import CustomNav from './CustomNav';
import CustomStats from './CustomStats';
import CustomHead from './CustomHead';
import CustomPagination from './CustomPagination';
import { ROWS_PER_PAGE } from '../constants';

type Props<T> = IPage<T>;

export default function CustomTable<T>(props: Props<T>) {
  const [t] = useTranslation();

  const active = useLocation().pathname.split('/');

  useEffect(() => props.setPage(1), [props.search]);

  return (
    <Stack spacing={8}>
      <CustomNav {...props} />
      {['goods', 'wares', 'products'].includes(active[1]) &&
        active.length === 2 && <CustomStats />}
      <CustomHead {...props} />
      <Paper withBorder>
        <ScrollArea>
          <Table
            miw={props.minWidth}
            horizontalSpacing={8}
            verticalSpacing={8}
            captionSide='bottom'
            highlightOnHover
          >
            <thead>
              <tr>
                {props.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.isFetching
                ? [...Array(10).keys()].map((key) => (
                    <tr key={key}>
                      {props.columns.map((column) => (
                        <td key={column}>
                          <Skeleton h={32} />
                        </td>
                      ))}
                    </tr>
                  ))
                : props.children}
            </tbody>
            {!props.isFetching && (
              <caption style={{ marginTop: 0 }}>
                {props.data?.result.length
                  ? `${t('components.pagination.from')} ${
                      (props.page - 1) * ROWS_PER_PAGE + 1
                    } ${t('components.pagination.to')} ${Math.min(
                      props.page * ROWS_PER_PAGE,
                      props.data.count,
                    )} ${t('components.pagination.of')} ${props.data.count}`
                  : t('components.pagination.no')}
              </caption>
            )}
          </Table>
        </ScrollArea>
      </Paper>
      <CustomPagination
        {...props}
        total={props.data && Math.ceil(props.data.count / ROWS_PER_PAGE)}
      />
    </Stack>
  );
}
