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
import { CreateRatingDto, EditRatingDto, RatingIdDto } from './rating.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
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

  @Get('polled')
  getPolledRatings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Rating>> {
    return this.ratingsService.getPolledRatings(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllRatings(@Query() req: Request): Promise<Response<Rating>> {
    return this.ratingsService.getAllRatings(req);
  }

  @Post()
  createRating(
    @MyId() myId: number,
    @Body() dto: CreateRatingDto,
  ): Promise<void> {
    return this.ratingsService.createRating({ ...dto, myId });
  }

  @Patch(':ratingId')
  editRating(
    @MyId() myId: number,
    @Param() { ratingId }: RatingIdDto,
    @Body() dto: EditRatingDto,
  ): Promise<void> {
    return this.ratingsService.editRating({ ...dto, ratingId, myId });
  }

  @Delete(':ratingId')
  deleteRating(
    @MyId() myId: number,
    @Param() { ratingId }: RatingIdDto,
  ): Promise<void> {
    return this.ratingsService.deleteRating({ ratingId, myId });
  }
}
