import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CardIdDto, CreateCardDto, EditCardDto } from './card.dto';
import { UserIdDto } from '../users/user.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('my')
  getMyCards(@MyId() myId: number): Promise<Card[]> {
    return this.cardsService.getMyCards(myId);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllCards(): Promise<Card[]> {
    return this.cardsService.getAllCards();
  }

  @Get('my/select')
  selectMyCards(@MyId() myId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(myId);
  }

  @Get(':userId/select')
  selectUserCards(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.cardsService.selectUserCards(userId);
  }

  @Roles(Role.BANKER)
  @Get(':userId/ext-select')
  selectUserCardsWithBalance(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(userId);
  }

  @Post()
  createCard(@MyId() myId: number, @Body() dto: CreateCardDto): Promise<void> {
    return this.cardsService.createCard({ ...dto, myId });
  }

  @Patch(':cardId')
  editCard(
    @MyId() myId: number,
    @Param() { cardId }: CardIdDto,
    @Body() dto: EditCardDto,
  ): Promise<void> {
    return this.cardsService.editCard({ ...dto, cardId, myId });
  }
}
