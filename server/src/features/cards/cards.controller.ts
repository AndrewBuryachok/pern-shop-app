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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/cards')
@Controller(':project/cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('my')
  getMyCards(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Card>> {
    return this.cardsService.getMyCards(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllCards(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Card>> {
    return this.cardsService.getAllCards(project, req);
  }

  @Get('my/select')
  selectMyCards(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(project, myId);
  }

  @Public()
  @Get(':userId/select')
  selectUserCards(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<Card[]> {
    return this.cardsService.selectUserCards(project, userId);
  }

  @Roles(Role.MODER, Role.BANKER)
  @Get(':userId/ext-select')
  selectUserCardsWithBalance(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(project, userId);
  }

  @Public()
  @Get(':cardId/users')
  selectCardUsers(
    @Param() { project }: ProjectDto,
    @Param() { cardId }: CardIdDto,
  ): Promise<User[]> {
    return this.cardsService.selectCardUsers(project, cardId);
  }

  @Post()
  createMyCard(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateCardDto,
  ): Promise<void> {
    return this.cardsService.createCard(project, { ...dto, userId: myId });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserCard(
    @Param() { project }: ProjectDto,
    @Body() dto: ExtCreateCardDto,
  ): Promise<void> {
    return this.cardsService.createCard(project, dto);
  }

  @Patch(':cardId')
  editCard(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: EditCardDto,
  ): Promise<void> {
    return this.cardsService.editCard(project, {
      ...dto,
      cardId,
      myId,
      hasRole,
    });
  }

  @Post(':cardId/users')
  addCardUser(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.addCardUser(project, {
      ...dto,
      cardId,
      myId,
      hasRole,
    });
  }

  @Delete(':cardId/users')
  removeCardUser(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.removeCardUser(project, {
      ...dto,
      cardId,
      myId,
      hasRole,
    });
  }
}
