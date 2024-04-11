import { CreateTagDto } from '../tags/tag.dto';

export interface CreateStorageTagDto extends CreateTagDto {
  storageId: number;
}

export interface EditStorageTagDto extends CreateTagDto {
  storageTagId: number;
}
