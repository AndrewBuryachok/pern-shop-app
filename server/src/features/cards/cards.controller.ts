import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.entity';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('my')
  getMyCards(myId: number): Promise<Card[]> {
    return this.cardsService.getMyCards(myId);
  }

  @Get('all')
  getAllCards(): Promise<Card[]> {
    return this.cardsService.getAllCards();
  }

  @Get('my/select')
  selectMyCards(myId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(myId);
  }

  @Get(':userId/select')
  selectUserCards(userId: number): Promise<Card[]> {
    return this.cardsService.selectUserCards(userId);
  }

  @Get(':userId/ext-select')
  selectUserCardsWithBalance(userId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(userId);
  }
}
