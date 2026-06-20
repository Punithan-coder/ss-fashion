// Config file to define base URL dynamically based on environment
const metaEnv = (import.meta as any).env;
export const API_BASE_URL = metaEnv?.VITE_API_URL || 'https://ss-fashionb.onrender.com';

export const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};
