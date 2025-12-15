import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
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
  private messagesRepositoryMap: Map<string, Repository<Message>>;

  constructor(
    @InjectRepository(Message, Database.DB1)
    private messages1Repository: Repository<Message>,
    @InjectRepository(Message, Database.DB2)
    private messages2Repository: Repository<Message>,
    private mqttService: MqttService,
  ) {
    this.messagesRepositoryMap = new Map(
      [this.messages1Repository, this.messages2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async selectMyMessages(project: string, myId: number): Promise<Message[]> {
    const chats = await this.messagesRepositoryMap
      .get(project)
      .createQueryBuilder('message')
      .where('message.userId = :myId OR message.chatId = :myId', { myId })
      .groupBy('LEAST(message.userId, message.chatId)')
      .addGroupBy('GREATEST(message.userId, message.chatId)')
      .select('MAX(message.id)', 'id')
      .getRawMany();
    if (!chats.length) {
      return [];
    }
    const messages = await this.messagesRepositoryMap
      .get(project)
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

  selectUserMessages(
    project: string,
    myId: number,
    userId: number,
  ): Promise<Message[]> {
    return this.selectMessagesQueryBuilder(project)
      .where('message.userId = :myId AND message.chatId = :userId', { userId })
      .orWhere('message.userId = :userId AND message.chatId = :myId', { myId })
      .getMany();
  }

  async createMessage(
    project: string,
    dto: ExtCreateMessageDto,
  ): Promise<void> {
    const { id } = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      dto.myId,
      dto.userId,
      dto.myId,
      Notification.MESSAGED_USER,
    );
    const body = await this.selectMessagesQueryBuilder(project)
      .where('message.id = :id', { id })
      .getOne();
    this.mqttService.publishEvent(
      project,
      dto.userId,
      Event.MESSAGES,
      dto.myId,
      JSON.stringify(body),
    );
    if (dto.userId !== dto.myId) {
      this.mqttService.publishEvent(
        project,
        dto.myId,
        Event.MESSAGES,
        dto.userId,
        JSON.stringify(body),
      );
    }
  }

  async editMessage(project: string, dto: ExtEditMessageDto): Promise<void> {
    const message = await this.checkMessageOwner(
      project,
      dto.messageId,
      dto.myId,
    );
    await this.edit(project, message, dto);
    const body = { id: dto.messageId, text: dto.text };
    this.mqttService.publishEvent(
      project,
      message.chatId,
      Event.MESSAGES,
      message.userId,
      JSON.stringify(body),
    );
    if (message.chatId !== message.userId) {
      this.mqttService.publishEvent(
        project,
        message.userId,
        Event.MESSAGES,
        message.chatId,
        JSON.stringify(body),
      );
    }
  }

  async deleteMessage(project: string, dto: DeleteMessageDto): Promise<void> {
    const message = await this.checkMessageOwner(
      project,
      dto.messageId,
      dto.myId,
    );
    await this.delete(project, message);
    const body = { id: dto.messageId };
    this.mqttService.publishEvent(
      project,
      message.chatId,
      Event.MESSAGES,
      message.userId,
      JSON.stringify(body),
    );
    if (message.chatId !== message.userId) {
      this.mqttService.publishEvent(
        project,
        message.userId,
        Event.MESSAGES,
        message.chatId,
        JSON.stringify(body),
      );
    }
  }

  async checkMessageExists(project: string, id: number): Promise<void> {
    await this.messagesRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkMessageOwner(
    project: string,
    id: number,
    userId: number,
  ): Promise<Message> {
    const message = await this.messagesRepositoryMap
      .get(project)
      .findOneBy({ id });
    if (message.userId !== userId) {
      throw new AppException(MessageError.NOT_OWNER);
    }
    return message;
  }

  private async create(
    project: string,
    dto: ExtCreateMessageDto,
  ): Promise<Message> {
    try {
      const message = this.messagesRepositoryMap.get(project).create({
        userId: dto.myId,
        chatId: dto.userId,
        replyId: dto.messageId || null,
        text: dto.text,
      });
      await this.messagesRepositoryMap.get(project).save(message);
      return message;
    } catch (error) {
      throw new AppException(MessageError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    message: Message,
    dto: ExtEditMessageDto,
  ): Promise<void> {
    try {
      message.text = dto.text;
      await this.messagesRepositoryMap.get(project).save(message);
    } catch (error) {
      throw new AppException(MessageError.EDIT_FAILED);
    }
  }

  private async delete(project: string, message: Message): Promise<void> {
    try {
      await this.messagesRepositoryMap.get(project).remove(message);
    } catch (error) {
      throw new AppException(MessageError.DELETE_FAILED);
    }
  }

  private selectMessagesQueryBuilder(
    project: string,
  ): SelectQueryBuilder<Message> {
    return this.messagesRepositoryMap
      .get(project)
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
