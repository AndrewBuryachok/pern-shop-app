import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoragesTagsService } from './storages-tags.service';
import { StorageTag } from './storage-tag.entity';
import { StorageTagState } from './storage-tag-state.entity';
import {
  CreateStorageTagDto,
  EditStorageTagDto,
  StorageTagIdDto,
} from './storage-tag.dto';
import { StorageIdDto } from '../storages/storage.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('storages-tags')
@Controller('storages-tags')
export class StoragesTagsController {
  constructor(private storagesTagsService: StoragesTagsService) {}

  @Public()
  @Get()
  getMainStoragesTags(@Query() req: Request): Promise<Response<StorageTag>> {
    return this.storagesTagsService.getMainStoragesTags(req);
  }

  @Get('my')
  getMyStoragesTags(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<StorageTag>> {
    return this.storagesTagsService.getMyStoragesTags(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllStoragesTags(@Query() req: Request): Promise<Response<StorageTag>> {
    return this.storagesTagsService.getAllStoragesTags(req);
  }

  @Public()
  @Get('free/select')
  selectFreeTags(): Promise<StorageTag[]> {
    return this.storagesTagsService.selectFreeTags();
  }

  @Public()
  @Get(':storageId/select')
  selectStorageTags(
    @Param() { storageId }: StorageIdDto,
  ): Promise<StorageTag[]> {
    return this.storagesTagsService.selectStorageTags(storageId);
  }

  @Public()
  @Get(':storageTagId/states')
  selectStorageTagStates(
    @Param() { storageTagId }: StorageTagIdDto,
  ): Promise<StorageTagState[]> {
    return this.storagesTagsService.selectStorageTagStates(storageTagId);
  }

  @Post()
  createStorageTag(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateStorageTagDto,
  ): Promise<void> {
    return this.storagesTagsService.createStorageTag({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':storageTagId')
  editStorageTag(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { storageTagId }: StorageTagIdDto,
    @Body() dto: EditStorageTagDto,
  ): Promise<void> {
    return this.storagesTagsService.editStorageTag({
      ...dto,
      storageTagId,
      myId,
      hasRole,
    });
  }
}
