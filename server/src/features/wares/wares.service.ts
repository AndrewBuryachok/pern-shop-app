import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ware } from './ware.entity';
import { RentsService } from '../rents/rents.service';
import { PaymentsService } from '../payments/payments.service';
import { BuyWareDto, ExtCreateWareDto } from './ware.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo, getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { WareError } from './ware-error.enum';

@Injectable()
export class WaresService {
  constructor(
    @InjectRepository(Ware)
    private waresRepository: Repository<Ware>,
    private rentsService: RentsService,
    private paymentsService: PaymentsService,
  ) {}

  async getWaresStats(): Promise<Stats> {
    const current = await this.waresRepository
      .createQueryBuilder('ware')
      .where('ware.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.waresRepository
      .createQueryBuilder('ware')
      .where('ware.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

  async getMainWares(req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(req)
      .andWhere('ware.amount > 0 AND rent.createdAt > :createdAt', {
        createdAt: getDateWeekAgo(),
      })
      .getManyAndCount();
    return { result, count };
  }

  async getMyWares(myId: number, req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(req)
      .andWhere('(ownerUser.id = :myId OR sellerUser.id = :myId)', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllWares(req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createWare(dto: ExtCreateWareDto): Promise<void> {
    await this.rentsService.checkRentOwner(dto.rentId, dto.myId);
    await this.create(dto);
  }

  async buyWare(dto: BuyWareDto): Promise<void> {
    const ware = await this.waresRepository.findOne({
      relations: ['rent'],
      where: { id: dto.wareId },
    });
    if (ware.amount < dto.amount) {
      throw new AppException(WareError.NOT_ENOUGH_AMOUNT);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: dto.cardId,
      receiverCardId: ware.rent.cardId,
      sum: dto.amount * ware.price,
      description: 'buy ware',
    });
    await this.buy(ware, dto.amount);
  }

  async checkWareExists(id: number): Promise<void> {
    await this.waresRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreateWareDto): Promise<void> {
    try {
      const ware = this.waresRepository.create({
        rentId: dto.rentId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.waresRepository.save(ware);
    } catch (error) {
      throw new AppException(WareError.CREATE_FAILED);
    }
  }

  private async buy(ware: Ware, amount: number): Promise<void> {
    try {
      ware.amount -= amount;
      await this.waresRepository.save(ware);
    } catch (error) {
      throw new AppException(WareError.BUY_FAILED);
    }
  }

  private getWaresQueryBuilder(req: Request): SelectQueryBuilder<Ware> {
    return this.waresRepository
      .createQueryBuilder('ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .where(
        '(ownerUser.name ILIKE :search OR sellerUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
      )
      .orderBy('ware.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'ware.id',
        'rent.id',
        'store.id',
        'market.id',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerUser.status',
        'sellerCard.name',
        'sellerCard.color',
        'ware.item',
        'ware.description',
        'ware.amount',
        'ware.intake',
        'ware.kit',
        'ware.price',
        'ware.createdAt',
      ]);
  }
}
