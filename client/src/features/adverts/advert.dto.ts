import { CreateServiceDto, EditServiceDto } from '../services/service.dto';

export interface CreateAdvertDto extends CreateServiceDto {}

export interface EditAdvertDto extends EditServiceDto {
  advertId: number;
}

export interface DeleteAdvertDto {
  advertId: number;
}

export interface RespondAdvertDto extends CreateServiceDto {
  advertId: number;
}
