import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { AnswerIdDto, CreateAnswerDto, EditAnswerDto } from './answer.dto';
import { HasRole, MyId } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private answersService: AnswersService) {}

  @Post()
  createAnswer(
    @MyId() myId: number,
    @Body() dto: CreateAnswerDto,
  ): Promise<void> {
    return this.answersService.createAnswer({ ...dto, myId });
  }

  @Patch(':answerId')
  editAnswer(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { answerId }: AnswerIdDto,
    @Body() dto: EditAnswerDto,
  ): Promise<void> {
    return this.answersService.editAnswer({
      ...dto,
      answerId,
      myId,
      hasRole,
    });
  }

  @Delete(':answerId')
  deleteAnswer(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { answerId }: AnswerIdDto,
  ): Promise<void> {
    return this.answersService.deleteAnswer({
      answerId,
      myId,
      hasRole,
    });
  }
}
