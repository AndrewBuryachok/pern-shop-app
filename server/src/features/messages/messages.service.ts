import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Message } from './message.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteMessageDto,
  ExtCreateMessageDto,
  ExtEditMessageDto,
} from './message.dto';
import { AppException } from '../../common/exceptions';
import { MessageError } from './message-error.enum';
import { Event, Notification } from '../../common/enums';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private mqttService: MqttService,
  ) {}

  async selectMyMessages(myId: number): Promise<Message[]> {
    const chats = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.userId = :myId OR message.chatId = :myId', { myId })
      .groupBy('LEAST(message.userId, message.chatId)')
      .addGroupBy('GREATEST(message.userId, message.chatId)')
      .select('MAX(message.id)', 'id')
      .getRawMany();
    if (!chats.length) {
      return [];
    }
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .innerJoin('message.user', 'senderUser')
      .innerJoin('message.chat', 'receiverUser')
      .where('message.id IN (:...ids)', { ids: chats.map((chat) => chat.id) })
      .orderBy('message.id', 'DESC')
      .select([
        'message.id',
        'senderUser.id',
        'senderUser.nick',
        'senderUser.avatar',
        'receiverUser.id',
        'receiverUser.nick',
        'receiverUser.avatar',
        'message.text',
        'message.createdAt',
      ])
      .getMany();
    return messages.map((message) => {
      message.user = message.user.id === myId ? message.chat : message.user;
      delete message.chat;
      return message;
    });
  }

  selectUserMessages(myId: number, userId: number): Promise<Message[]> {
    return this.selectMessagesQueryBuilder()
      .where('message.userId = :myId AND message.chatId = :userId', { userId })
      .orWhere('message.userId = :userId AND message.chatId = :myId', { myId })
      .getMany();
  }

  async createMessage(
    dto: ExtCreateMessageDto & { nick: string },
  ): Promise<void> {
    const { id } = await this.create(dto);
    this.mqttService.publishNotification(
      dto.myId,
      dto.userId,
      dto.nick,
      Notification.MESSAGED_USER,
    );
    const body = await this.selectMessagesQueryBuilder()
      .where('message.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      dto.userId,
      Event.MESSAGES,
      dto.myId,
      JSON.stringify(body),
    );
    if (dto.userId !== dto.myId) {
      this.mqttService.publishEvent(
        dto.myId,
        Event.MESSAGES,
        dto.userId,
        JSON.stringify(body),
      );
    }
  }

  async editMessage(dto: ExtEditMessageDto): Promise<void> {
    const message = await this.checkMessageOwner(dto.messageId, dto.myId);
    await this.edit(message, dto);
    const body = { id: dto.messageId, text: dto.text };
    this.mqttService.publishEvent(
      message.chatId,
      Event.MESSAGES,
      message.userId,
      JSON.stringify(body),
    );
    if (message.chatId !== message.userId) {
      this.mqttService.publishEvent(
        message.userId,
        Event.MESSAGES,
        message.chatId,
        JSON.stringify(body),
      );
    }
  }

  async deleteMessage(dto: DeleteMessageDto): Promise<void> {
    const message = await this.checkMessageOwner(dto.messageId, dto.myId);
    await this.delete(message);
    const body = { id: dto.messageId };
    this.mqttService.publishEvent(
      message.chatId,
      Event.MESSAGES,
      message.userId,
      JSON.stringify(body),
    );
    if (message.chatId !== message.userId) {
      this.mqttService.publishEvent(
        message.userId,
        Event.MESSAGES,
        message.chatId,
        JSON.stringify(body),
      );
    }
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

  private selectMessagesQueryBuilder(): SelectQueryBuilder<Message> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .leftJoin('message.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .innerJoin('message.user', 'messager')
      .orderBy('message.id', 'ASC')
      .select([
        'message.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'reply.createdAt',
        'messager.id',
        'messager.nick',
        'messager.avatar',
        'message.text',
        'message.createdAt',
      ]);
  }
}
