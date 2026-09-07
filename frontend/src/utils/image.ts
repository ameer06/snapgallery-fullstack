export const getImageUrl = (url?: string): string => {
  if (!url) return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:8080${cleanUrl}`;
};

