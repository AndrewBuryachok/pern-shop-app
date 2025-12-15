import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { MessageIdDto, CreateMessageDto, EditMessageDto } from './message.dto';
import { UserIdDto } from '../users/user.dto';
import { ProjectDto } from '../../project.dto';
import { MyId } from '../../common/decorators';

@ApiTags(':project/messages')
@Controller(':project/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('my')
  selectMyMessages(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<Message[]> {
    return this.messagesService.selectMyMessages(project, myId);
  }

  @Get(':userId')
  selectUserMessages(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<Message[]> {
    return this.messagesService.selectUserMessages(project, myId, userId);
  }

  @Post()
  createMessage(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateMessageDto,
  ): Promise<void> {
    return this.messagesService.createMessage(project, { ...dto, myId });
  }

  @Patch(':messageId')
  editMessage(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { messageId }: MessageIdDto,
    @Body() dto: EditMessageDto,
  ): Promise<void> {
    return this.messagesService.editMessage(project, {
      ...dto,
      messageId,
      myId,
    });
  }

  @Delete(':messageId')
  deleteMessage(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { messageId }: MessageIdDto,
  ): Promise<void> {
    return this.messagesService.deleteMessage(project, { messageId, myId });
  }
}
