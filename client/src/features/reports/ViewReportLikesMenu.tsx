import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Report } from './report.model';
import { useSelectReportLikesQuery } from './reports.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewReportLikesModal } from './ViewReportLikesModal';

type Props = IModal<Report> & { type: boolean };

export default function ViewReportLikesMenu({ data: report, type }: Props) {
  const { data, isFetching } = useSelectReportLikesQuery(report.id);

  const likes = data?.filter((like) => like.type === type);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {likes?.slice(0, 4).map((like) => (
            <Tooltip key={like.id} label={like.user.nick} withArrow>
              <div>
                <LinkedAvatar {...like.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewReportLikesModal(report)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
