import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from './discussion.entity';
import { PollsService } from '../polls/polls.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteDiscussionDto,
  ExtCreateDiscussionDto,
  ExtEditDiscussionDto,
} from './discussion.dto';
import { AppException } from '../../common/exceptions';
import { DiscussionError } from './discussion-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionsRepository: Repository<Discussion>,
    private pollsService: PollsService,
    private mqttService: MqttService,
  ) {}

  async createDiscussion(dto: ExtCreateDiscussionDto): Promise<void> {
    const poll = await this.pollsService.checkPollNotCompleted(dto.pollId);
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      poll.userId,
      Notification.DISCUSSED_POLL,
    );
  }

  async editDiscussion(dto: ExtEditDiscussionDto): Promise<void> {
    const discussion = await this.checkDiscussionOwner(
      dto.discussionId,
      dto.myId,
      dto.hasRole,
    );
    await this.pollsService.checkPollNotCompleted(discussion.pollId);
    await this.edit(discussion, dto);
  }

  async deleteDiscussion(dto: DeleteDiscussionDto): Promise<void> {
    const discussion = await this.checkDiscussionOwner(
      dto.discussionId,
      dto.myId,
      dto.hasRole,
    );
    await this.pollsService.checkPollNotCompleted(discussion.pollId);
    await this.delete(discussion);
  }

  async checkDiscussionExists(id: number): Promise<void> {
    await this.discussionsRepository.findOneByOrFail({ id });
  }

  async checkDiscussionOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Discussion> {
    const discussion = await this.discussionsRepository.findOneBy({ id });
    if (discussion.userId !== userId && !hasRole) {
      throw new AppException(DiscussionError.NOT_OWNER);
    }
    return discussion;
  }

  private async create(dto: ExtCreateDiscussionDto): Promise<void> {
    try {
      const discussion = this.discussionsRepository.create({
        pollId: dto.pollId,
        userId: dto.myId,
        text: dto.text,
      });
      await this.discussionsRepository.save(discussion);
    } catch (error) {
      throw new AppException(DiscussionError.CREATE_FAILED);
    }
  }

  private async edit(
    discussion: Discussion,
    dto: ExtEditDiscussionDto,
  ): Promise<void> {
    try {
      discussion.text = dto.text;
      await this.discussionsRepository.save(discussion);
    } catch (error) {
      throw new AppException(DiscussionError.EDIT_FAILED);
    }
  }

  private async delete(discussion: Discussion): Promise<void> {
    try {
      await this.discussionsRepository.remove(discussion);
    } catch (error) {
      throw new AppException(DiscussionError.DELETE_FAILED);
    }
  }
}
