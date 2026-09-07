import { api } from './client';
import { Event, EventMember, PageResponse, User } from '../types';

export const eventsApi = {
  getEvents: (page = 0, size = 20) =>
    api.get<PageResponse<Event>>(`/events?page=${page}&size=${size}`),

  getEventById: (id: string) =>
    api.get<Event>(`/events/${id}`),

  createEvent: (data: { name: string; description?: string; eventDate: string; location?: string; coverPhotoUrl?: string }) =>
    api.post<Event>('/events', data),

  updateEvent: (id: string, data: { name: string; description?: string; eventDate: string; location?: string; coverPhotoUrl?: string }) =>
    api.put<Event>(`/events/${id}`, data),

  deleteEvent: (id: string) =>
    api.delete<void>(`/events/${id}`),

  getMembers: (eventId: string) =>
    api.get<EventMember[]>(`/events/${eventId}/members`),

  addMember: (eventId: string, userId: string) =>
    api.post<EventMember>(`/events/${eventId}/members`, { userId }),

  removeMember: (eventId: string, userId: string) =>
    api.delete<void>(`/events/${eventId}/members/${userId}`),

  getTeamMembers: () =>
    api.get<User[]>('/admin/team'),

  createTeamMember: (data: { name: string; email: string; password: string }) =>
    api.post<User>('/admin/team', { ...data, role: 'TEAM_MEMBER' }),
};
