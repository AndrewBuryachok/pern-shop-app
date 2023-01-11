import { ReactNode } from 'react';
import { Paper, ScrollArea, Skeleton, Stack, Table } from '@mantine/core';
import { IPage } from '../interfaces';
import CustomNav from './CustomNav';
import CustomHead from './CustomHead';
import CustomPagination from './CustomPagination';
import { ROWS_PER_PAGE } from '../constants';

type Props<T> = IPage<T>;

export default function CustomTable<T>(props: Props<T>) {
  return (
    <Stack spacing={8}>
      <CustomNav {...props} />
      <CustomHead {...props} />
      <Paper>
        <ScrollArea>
          <Table
            sx={{ minWidth: props.minWidth }}
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
              {props.isLoading &&
                [...Array(4).keys()].map((key) => (
                  <tr key={key - 4}>
                    {props.columns.map((column) => (
                      <td key={column}>
                        <Skeleton height={16} />
                      </td>
                    ))}
                  </tr>
                ))}
              {props.children}
            </tbody>
            {props.data && (
              <caption style={{ marginTop: 0 }}>
                {props.data.result.length
                  ? `Showing ${
                      (props.page - 1) * ROWS_PER_PAGE + 1
                    } to ${Math.min(
                      props.page * ROWS_PER_PAGE,
                      props.data.count,
                    )} of ${props.data.count}`
                  : 'No data to display'}
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