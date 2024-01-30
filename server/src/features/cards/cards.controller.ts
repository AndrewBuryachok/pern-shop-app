import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { User } from '../users/user.entity';
import {
  CardIdDto,
  CreateCardDto,
  EditCardDto,
  ExtCreateCardDto,
  UpdateCardUserDto,
} from './card.dto';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('my')
  getMyCards(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Card>> {
    return this.cardsService.getMyCards(myId, req);
  }

  @Roles(Role.BANKER)
  @Get('all')
  getAllCards(@Query() req: Request): Promise<Response<Card>> {
    return this.cardsService.getAllCards(req);
  }

  @Get('my/select')
  selectMyCards(@MyId() myId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(myId);
  }

  @Public()
  @Get(':userId/select')
  selectUserCards(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.cardsService.selectUserCards(userId);
  }

  @Roles(Role.ADMIN, Role.BANKER, Role.MANAGER)
  @Get(':userId/ext-select')
  selectUserCardsWithBalance(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(userId);
  }

  @Public()
  @Get(':cardId/users')
  selectCardUsers(@Param() { cardId }: CardIdDto): Promise<User[]> {
    return this.cardsService.selectCardUsers(cardId);
  }

  @Post()
  createMyCard(
    @MyId() myId: number,
    @Body() dto: CreateCardDto,
  ): Promise<void> {
    return this.cardsService.createCard({ ...dto, userId: myId });
  }

  @Roles(Role.BANKER)
  @Post('all')
  createUserCard(@Body() dto: ExtCreateCardDto): Promise<void> {
    return this.cardsService.createCard(dto);
  }

  @Patch(':cardId')
  editCard(
    @MyId() myId: number,
    @HasRole(Role.BANKER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: EditCardDto,
  ): Promise<void> {
    return this.cardsService.editCard({ ...dto, cardId, myId, hasRole });
  }

  @Post(':cardId/users')
  addCardUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.BANKER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.addCardUser({
      ...dto,
      cardId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':cardId/users')
  removeCardUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.BANKER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.removeCardUser({
      ...dto,
      cardId,
      myId,
      nick,
      hasRole,
    });
  }
}
