import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { useSelectReportViewsQuery } from './reports.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewReportViewsModal } from './ViewReportViewsModal';

type Props = IModal<Report>;

export default function ViewReportViewsMenu({ data: report }: Props) {
  const { data: views, isFetching } = useSelectReportViewsQuery(report.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {views?.slice(0, 4).map((view) => (
            <Tooltip key={view.id} label={view.user.nick} withArrow>
              <div>
                <LinkedAvatar {...view.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewReportViewsModal(report)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
