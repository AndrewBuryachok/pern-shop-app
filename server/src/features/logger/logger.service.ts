import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { Request } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { LogError } from './log-error.enum';

@Injectable()
export class LoggerService {
  private ips = new Set<string>();

  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  addIp(ip: string): void {
    this.ips.add(ip);
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
    const count = this.ips.size;
    this.ips.clear();
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
