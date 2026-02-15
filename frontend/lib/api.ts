import axios from 'axios';
import { authStorage } from './auth';
import type {
  AuthResponse,
  CareerPathCatalogItem,
  RecommendationHistoryItem,
  RecommendationRequest,
  RecommendationResponse,
  ResumeAnalysis,
  User
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = <T>(response: { data: { data?: T } }): T => response.data.data as T;

export const apiClient = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    skills?: string[];
    interests?: string[];
    experienceLevel?: 'entry' | 'mid' | 'senior';
  }) => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },
  googleSignIn: async (payload: { idToken: string }) => {
    const response = await api.post<AuthResponse>('/auth/google', payload);
    return response.data;
  },
  me: async () => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  },
  updateProfile: async (payload: Partial<User>) => {
    const response = await api.patch<{ success: boolean; user: User }>('/auth/me', payload);
    return response.data.user;
  },
  analyzeResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post<{ success: boolean; data: ResumeAnalysis }>('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return unwrap<ResumeAnalysis>(response);
  },
  getRecommendations: async (payload: RecommendationRequest) => {
    const response = await api.post<{ success: boolean; data: RecommendationResponse }>('/recommendations', payload);
    return unwrap<RecommendationResponse>(response);
  },
  getRecommendationHistory: async () => {
    const response = await api.get<{ success: boolean; data: RecommendationHistoryItem[] }>(
      '/recommendations/history?limit=8'
    );
    return unwrap<RecommendationHistoryItem[]>(response);
  },
  askChatAssistant: async (payload: { message: string; recommendationContext?: unknown[] }) => {
    const response = await api.post<{ success: boolean; data: { reply: string } }>('/chat/ask', payload);
    return unwrap<{ reply: string }>(response);
  },
  getCareers: async () => {
    const response = await api.get<{ success: boolean; data: CareerPathCatalogItem[] }>('/careers');
    return unwrap<CareerPathCatalogItem[]>(response);
  }
};

export default api;
