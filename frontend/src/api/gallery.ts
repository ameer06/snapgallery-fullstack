import { api } from './client';
import { Gallery, PageResponse, Photo, PublicGalleryInfo, VerifyPinResponse } from '../types';

export const galleryApi = {
  createGallery: (eventId: string, data: { name: string; description?: string; pin: string; photoIds: string[]; expiresAt?: string }) =>
    api.post<Gallery>(`/events/${eventId}/gallery`, data),

  getGalleriesForEvent: (eventId: string) =>
    api.get<Gallery[]>(`/events/${eventId}/gallery`),

  updateGallery: (galleryId: string, data: { name: string; description?: string; pin?: string; photoIds?: string[]; expiresAt?: string }) =>
    api.put<Gallery>(`/galleries/${galleryId}`, data),

  publishGallery: (galleryId: string) =>
    api.post<Gallery>(`/galleries/${galleryId}/publish`),

  unpublishGallery: (galleryId: string) =>
    api.post<Gallery>(`/galleries/${galleryId}/unpublish`),

  // Public customer routes
  getPublicGalleryInfo: (slug: string) =>
    api.get<PublicGalleryInfo>(`/public/gallery/${slug}`),

  verifyPin: (slug: string, pin: string) =>
    api.post<VerifyPinResponse>(`/public/gallery/${slug}/verify`, { pin }),

  getPublicPhotos: (slug: string, page = 0, size = 50) =>
    api.get<PageResponse<Photo>>(`/public/gallery/${slug}/photos?page=${page}&size=${size}`),
};
