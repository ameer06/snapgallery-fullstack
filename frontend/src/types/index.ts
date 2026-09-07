export type UserRole = 'ADMIN' | 'TEAM_MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  coverPhotoUrl?: string;
  createdBy: User;
  totalPhotos: number;
  totalMembers: number;
  galleryPublished?: boolean;
  gallerySlug?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventMember {
  id: string;
  eventId: string;
  user: User;
  assignedAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  uploadedBy: User;
  originalFilename: string;
  storageKey: string;
  storageUrl: string;
  fileSize?: number;
  contentType?: string;
  createdAt: string;
}

export type GalleryStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'EXPIRED';

export interface Gallery {
  id: string;
  eventId: string;
  eventName: string;
  name: string;
  description?: string;
  publicSlug: string;
  status: GalleryStatus;
  publishedAt?: string;
  expiresAt?: string;
  totalPhotos: number;
  photoIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PublicGalleryInfo {
  name: string;
  description?: string;
  publicSlug: string;
  status: GalleryStatus;
  totalPhotos: number;
  publishedAt?: string;
}

export interface VerifyPinResponse {
  sessionToken: string;
  publicSlug: string;
  expiresMs: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
