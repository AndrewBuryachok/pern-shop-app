import { emptyApi } from '../../app/empty.api';
import {
  CreateAnnotationDto,
  DeleteAnnotationDto,
  EditAnnotationDto,
} from './annotation.dto';

export const annotationsApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createAnnotation: build.mutation<void, CreateAnnotationDto>({
      query: (dto) => ({
        url: '/annotations',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Annotation'],
    }),
    editAnnotation: build.mutation<void, EditAnnotationDto>({
      query: ({ annotationId, ...dto }) => ({
        url: `/annotations/${annotationId}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['Annotation'],
    }),
    deleteAnnotation: build.mutation<void, DeleteAnnotationDto>({
      query: ({ annotationId }) => ({
        url: `/annotations/${annotationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Annotation'],
    }),
  }),
});

export const {
  useCreateAnnotationMutation,
  useEditAnnotationMutation,
  useDeleteAnnotationMutation,
} = annotationsApi;
