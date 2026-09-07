import { api } from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password, role }),

  getCurrentUser: () =>
    api.get<User>('/auth/me'),
};
