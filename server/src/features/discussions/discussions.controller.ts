import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import {
  CreateDiscussionDto,
  EditDiscussionDto,
  DiscussionIdDto,
} from './discussion.dto';
import { HasRole, MyId } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private discussionsService: DiscussionsService) {}

  @Post()
  createDiscussion(
    @MyId() myId: number,
    @Body() dto: CreateDiscussionDto,
  ): Promise<void> {
    return this.discussionsService.createDiscussion({ ...dto, myId });
  }

  @Patch(':discussionId')
  editDiscussion(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { discussionId }: DiscussionIdDto,
    @Body() dto: EditDiscussionDto,
  ): Promise<void> {
    return this.discussionsService.editDiscussion({
      ...dto,
      discussionId,
      myId,
      hasRole,
    });
  }

  @Delete(':discussionId')
  deleteDiscussion(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { discussionId }: DiscussionIdDto,
  ): Promise<void> {
    return this.discussionsService.deleteDiscussion({
      discussionId,
      myId,
      hasRole,
    });
  }
}
