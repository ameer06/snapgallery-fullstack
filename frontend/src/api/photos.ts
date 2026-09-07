import { api } from './client';
import { PageResponse, Photo } from '../types';

export const photosApi = {
  uploadPhotos: (eventId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post<Photo[]>(`/events/${eventId}/photos`, formData);
  },

  getEventPhotos: (eventId: string, uploaderId?: string, page = 0, size = 50) => {
    let url = `/events/${eventId}/photos?page=${page}&size=${size}`;
    if (uploaderId) url += `&uploaderId=${uploaderId}`;
    return api.get<PageResponse<Photo>>(url);
  },

  getOwnUploads: (page = 0, size = 50) =>
    api.get<PageResponse<Photo>>(`/member/uploads?page=${page}&size=${size}`),

  deletePhoto: (photoId: string) =>
    api.delete<void>(`/photos/${photoId}`),
};
