const getBackendBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '');
  }
  return 'http://localhost:8080';
};

export const getImageUrl = (url?: string): string => {
  if (!url) return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${getBackendBaseUrl()}${cleanUrl}`;
};


