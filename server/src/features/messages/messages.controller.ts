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
import { MyId, MyNick } from '../../common/decorators';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('my')
  selectMyMessages(@MyId() myId: number): Promise<Message[]> {
    return this.messagesService.selectMyMessages(myId);
  }

  @Get(':userId')
  selectUserMessages(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<Message[]> {
    return this.messagesService.selectUserMessages(myId, userId);
  }

  @Post()
  createMessage(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateMessageDto,
  ): Promise<void> {
    return this.messagesService.createMessage({ ...dto, myId, nick });
  }

  @Patch(':messageId')
  editMessage(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { messageId }: MessageIdDto,
    @Body() dto: EditMessageDto,
  ): Promise<void> {
    return this.messagesService.editMessage({
      ...dto,
      messageId,
      myId,
      nick,
    });
  }

  @Delete(':messageId')
  deleteMessage(
    @MyId() myId: number,
    @Param() { messageId }: MessageIdDto,
  ): Promise<void> {
    return this.messagesService.deleteMessage({ messageId, myId });
  }
}
