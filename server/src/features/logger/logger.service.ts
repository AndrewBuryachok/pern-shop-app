import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Log } from './log.entity';
import { Request } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { LogError } from './log-error.enum';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
    @InjectRedis()
    private redis: Redis,
  ) {}

  async addIp(ip: string): Promise<void> {
    await this.redis.sadd('ips', ip);
  }

  getLogs(req: Request): Promise<Log[]> {
    return this.logsRepository
      .createQueryBuilder('log')
      .orderBy('log.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select(['log.id', 'log.count', 'log.createdAt'])
      .getMany();
  }

  async createLog(): Promise<void> {
    const count = await this.redis.scard('ips');
    await this.redis.del('ips');
    await this.create(count);
  }

  private async create(count: number): Promise<void> {
    try {
      const log = this.logsRepository.create({ count });
      await this.logsRepository.save(log);
    } catch (error) {
      throw new AppException(LogError.CREATE_FAILED);
    }
  }
}
