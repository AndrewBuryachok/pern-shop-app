import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteMessageDto,
  ExtCreateMessageDto,
  ExtEditMessageDto,
} from './message.dto';
import { AppException } from '../../common/exceptions';
import { MessageError } from './message-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private mqttService: MqttService,
  ) {}

  getUserMessages(myId: number, userId: number): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .leftJoin('message.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .innerJoin('message.user', 'messager')
      .where('message.userId = :myId AND message.chatId = :userId', { userId })
      .orWhere('message.userId = :userId AND message.chatId = :myId', { myId })
      .orderBy('message.id', 'ASC')
      .select([
        'message.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'messager.id',
        'messager.nick',
        'messager.avatar',
        'message.text',
        'message.createdAt',
      ])
      .getMany();
  }

  async createMessage(
    dto: ExtCreateMessageDto & { nick: string },
  ): Promise<void> {
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      dto.myId,
      dto.userId,
      dto.nick,
      Notification.MESSAGED_USER,
    );
  }

  async editMessage(dto: ExtEditMessageDto & { nick: string }): Promise<void> {
    const message = await this.checkMessageOwner(dto.messageId, dto.myId);
    await this.edit(message, dto);
  }

  async deleteMessage(dto: DeleteMessageDto): Promise<void> {
    const message = await this.checkMessageOwner(dto.messageId, dto.myId);
    await this.delete(message);
  }

  async checkMessageExists(id: number): Promise<void> {
    await this.messagesRepository.findOneByOrFail({ id });
  }

  async checkMessageOwner(id: number, userId: number): Promise<Message> {
    const message = await this.messagesRepository.findOneBy({ id });
    if (message.userId !== userId) {
      throw new AppException(MessageError.NOT_OWNER);
    }
    return message;
  }

  private async create(dto: ExtCreateMessageDto): Promise<Message> {
    try {
      const message = this.messagesRepository.create({
        userId: dto.myId,
        chatId: dto.userId,
        replyId: dto.messageId || null,
        text: dto.text,
      });
      await this.messagesRepository.save(message);
      return message;
    } catch (error) {
      throw new AppException(MessageError.CREATE_FAILED);
    }
  }

  private async edit(message: Message, dto: ExtEditMessageDto): Promise<void> {
    try {
      message.text = dto.text;
      await this.messagesRepository.save(message);
    } catch (error) {
      throw new AppException(MessageError.EDIT_FAILED);
    }
  }

  private async delete(message: Message): Promise<void> {
    try {
      await this.messagesRepository.remove(message);
    } catch (error) {
      throw new AppException(MessageError.DELETE_FAILED);
    }
  }
}
