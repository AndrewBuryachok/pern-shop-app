import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { PlaintsService } from '../plaints/plaints.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteAnswerDto,
  ExtCreateAnswerDto,
  ExtEditAnswerDto,
} from './answer.dto';
import { AppException } from '../../common/exceptions';
import { AnswerError } from './answer-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
    private plaintsService: PlaintsService,
    private mqttService: MqttService,
  ) {}

  async createAnswer(dto: ExtCreateAnswerDto): Promise<void> {
    const plaint = await this.plaintsService.checkPlaintNotCompleted(
      dto.plaintId,
    );
    await this.create(dto);
    [plaint.senderUserId, plaint.receiverUserId].forEach((userId) =>
      this.mqttService.publishNotificationMessage(
        userId,
        Notification.ANSWERED_PLAINT,
      ),
    );
  }

  async editAnswer(dto: ExtEditAnswerDto): Promise<void> {
    const answer = await this.checkAnswerOwner(
      dto.answerId,
      dto.myId,
      dto.hasRole,
    );
    await this.plaintsService.checkPlaintNotCompleted(answer.plaintId);
    await this.edit(answer, dto);
  }

  async deleteAnswer(dto: DeleteAnswerDto): Promise<void> {
    const answer = await this.checkAnswerOwner(
      dto.answerId,
      dto.myId,
      dto.hasRole,
    );
    await this.plaintsService.checkPlaintNotCompleted(answer.plaintId);
    await this.delete(answer);
  }

  async checkAnswerExists(id: number): Promise<void> {
    await this.answersRepository.findOneByOrFail({ id });
  }

  async checkAnswerOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Answer> {
    const answer = await this.answersRepository.findOneBy({ id });
    if (answer.userId !== userId && !hasRole) {
      throw new AppException(AnswerError.NOT_OWNER);
    }
    return answer;
  }

  private async create(dto: ExtCreateAnswerDto): Promise<void> {
    try {
      const answer = this.answersRepository.create({
        plaintId: dto.plaintId,
        userId: dto.myId,
        text: dto.text,
      });
      await this.answersRepository.save(answer);
    } catch (error) {
      throw new AppException(AnswerError.CREATE_FAILED);
    }
  }

  private async edit(answer: Answer, dto: ExtEditAnswerDto): Promise<void> {
    try {
      answer.text = dto.text;
      await this.answersRepository.save(answer);
    } catch (error) {
      throw new AppException(AnswerError.EDIT_FAILED);
    }
  }

  private async delete(answer: Answer): Promise<void> {
    try {
      await this.answersRepository.remove(answer);
    } catch (error) {
      throw new AppException(AnswerError.DELETE_FAILED);
    }
  }
}
