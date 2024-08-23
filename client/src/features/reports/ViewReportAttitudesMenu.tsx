import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import {
  useSelectReportDownAttitudesQuery,
  useSelectReportUpAttitudesQuery,
} from './reports.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewReportAttitudesModal } from './ViewReportAttitudesModal';

type Props = IModal<Report> & { type: boolean };

export default function ViewReportAttitudesMenu({ data: report, type }: Props) {
  const { data: attitudes, isFetching } = (
    type ? useSelectReportUpAttitudesQuery : useSelectReportDownAttitudesQuery
  )(report.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {attitudes?.slice(0, 4).map((attitude) => (
            <Tooltip key={attitude.id} label={attitude.user.nick} withArrow>
              <div>
                <LinkedAvatar {...attitude.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewReportAttitudesModal(report, type)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
