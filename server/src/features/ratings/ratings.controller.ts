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
import { RatingsService } from './ratings.service';
import { Rating } from './rating.entity';
import {
  CreateRatingDto,
  EditRatingDto,
  ExtCreateRatingDto,
  RatingIdDto,
} from './rating.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get('my')
  getMyRatings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Rating>> {
    return this.ratingsService.getMyRatings(myId, req);
  }

  @Get('received')
  getReceivedRatings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Rating>> {
    return this.ratingsService.getReceivedRatings(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllRatings(@Query() req: Request): Promise<Response<Rating>> {
    return this.ratingsService.getAllRatings(req);
  }

  @Post()
  createMyRating(
    @MyId() myId: number,
    @Body() dto: CreateRatingDto,
  ): Promise<void> {
    return this.ratingsService.createRating({ ...dto, senderUserId: myId });
  }

  @Roles(Role.ADMIN)
  @Post('all')
  createUserRating(@Body() dto: ExtCreateRatingDto): Promise<void> {
    return this.ratingsService.createRating(dto);
  }

  @Patch(':ratingId')
  editRating(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { ratingId }: RatingIdDto,
    @Body() dto: EditRatingDto,
  ): Promise<void> {
    return this.ratingsService.editRating({ ...dto, ratingId, myId, hasRole });
  }

  @Delete(':ratingId')
  deleteRating(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { ratingId }: RatingIdDto,
  ): Promise<void> {
    return this.ratingsService.deleteRating({ ratingId, myId, hasRole });
  }
}
