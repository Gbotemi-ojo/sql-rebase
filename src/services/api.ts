import axios from 'axios';

// --- Type Definitions ---

export interface Category {
  id: number;
  name: string;
}

export interface Business {
  name: string;
  phone: string | null;
  website: string | null;
}

export interface BusinessWithCategory extends Business {
  id: number;
  categoryId: number;
  status: 'New' | 'Messaged';
  category: Category;
}

export interface ApiResponse {
  message: string;
  added: number;
  skipped: number;
  skippedDetails: Business[];
}

// --- API Client Setup ---

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Category Functions ---

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (name: string): Promise<void> => {
  await apiClient.post('/categories', { name });
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

// --- Business Functions ---

export const getBusinesses = async (): Promise<BusinessWithCategory[]> => {
  const { data } = await apiClient.get('/businesses');
  return data;
};

export const postBusinesses = async (businesses: Business[], categoryId: number): Promise<ApiResponse> => {
  const { data } = await apiClient.post('/businesses/batch', { businesses, categoryId });
  return data;
};

export const updateBusinessStatus = async (id: number, status: 'New' | 'Messaged'): Promise<void> => {
  await apiClient.patch(`/businesses/${id}/status`, { status });
};
