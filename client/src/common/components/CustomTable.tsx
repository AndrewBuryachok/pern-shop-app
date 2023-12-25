import { useTranslation } from 'react-i18next';
import { Paper, ScrollArea, Skeleton, Stack, Table } from '@mantine/core';
import { IPageWithColumns } from '../interfaces';
import { ROWS_PER_PAGE } from '../constants';
import CustomPage from './CustomPage';

type Props<T> = IPageWithColumns<T>;

export default function CustomTable<T>(props: Props<T>) {
  const [t] = useTranslation();

  return (
    <CustomPage {...props}>
      <Paper>
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
    </CustomPage>
  );
}
