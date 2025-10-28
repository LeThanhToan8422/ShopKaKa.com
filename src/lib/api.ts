import axios from 'axios';

// Get the backend URL from environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Remove withCredentials since we're using localStorage for tokens
});

// Add a request interceptor to include auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage and add to Authorization header
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // TODO: Re-enable token refresh when the refresh API is available
    // Currently commented out because there's no /auth/refresh endpoint
    /*
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh the token
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          
          // Store new tokens
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, clear tokens and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('name');
          }
        }
      }
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    */
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (username: string, password: string) => 
    apiClient.post('/login', { username, password }),
  
  register: (username: string, password: string, name: string) => 
    apiClient.post('/register', { username, password, name }),
    
  // TODO: Re-enable when refresh API is available
  // refresh: (refreshToken: string) => 
  //   apiClient.post('/auth/refresh', { refreshToken }),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (name: string) => apiClient.put('/user/profile', { name }),
};

// Sale Account APIs
export const saleAccountAPI = {
  getById: (id: string) => apiClient.get(`/saleAccount/${id}`),
  update: (id: string, data: any, files?: File[]) => {
    // Always use multipart form data for consistency
    const formData = new FormData();
    
    // Append the ID to the form data
    formData.append('id', id);
    
    // Append all the data fields individually
    Object.keys(data).forEach(key => {
      // Handle arrays specially - append each item individually
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: number) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Append each file if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('images', file, file.name);
      });
    }
    
    return apiClient.put('/saleAccount', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id: string) => apiClient.delete(`/saleAccount/${id}`),
  getAll: (params?: { 
    rank?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    minHeroes?: number; 
    minSkins?: number;
    price?: number;
    blindBoxId?: string;
    page?: number; 
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/saleAccount/getAll${queryString ? `?${queryString}` : ''}`);
  },
  create: (data: any, files?: File[]) => {
    // Always use multipart form data for consistency
    const formData = new FormData();
    
    // Append all the data fields individually
    Object.keys(data).forEach(key => {
      // Handle arrays specially - append each item individually
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: number) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Append each file if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('images', file, file.name);
      });
    }
    
    return apiClient.post('/saleAccount', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  upload: (blindBoxId: string, file: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/saleAccount/upload?blindBoxId=${blindBoxId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getBlindBag: (userId: string, blindBoxId: string) => 
    apiClient.post('/saleAccount/blindBag', { userId, blindBoxId }),
  getByUserId: (userId: string, page?: number, size?: number) => {
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', String(page));
    if (size !== undefined) queryParams.append('size', String(size));
    const queryString = queryParams.toString();
    return apiClient.get(`/saleAccount/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  // New endpoint for fetching blind boxes
  getBlindBoxes: (params?: { page?: number; size?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/blindBox/getAll${queryString ? `?${queryString}` : ''}`);
  },
  // New endpoint for tearing a blind box
  tearBlindBox: (data: { owner: string; accountId: string; blindBoxId: string }) => 
    apiClient.post('/blindBox/tear', data),
  // New endpoint for creating a blind box
  createBlindBox: (data: { name: string; price?: number; saleAccounts?: string[] }) => 
    apiClient.post('/blindBox', data),
  // New endpoint for updating a blind box
  updateBlindBox: (data: { id: string; name: string; price?: number; saleAccounts?: string[] }) => 
    apiClient.put('/blindBox', data),
  // New endpoint for deleting a blind box
  deleteBlindBox: (id: string) => 
    apiClient.delete(`/blindBox/${id}`),
  // New endpoint for getting a specific blind box
  getBlindBoxById: (id: string) => 
    apiClient.get(`/blindBox/${id}`),
  // New endpoint for adding accounts to a blind box
  addAccountToBlindBox: (data: { blindBoxId: string; accountId: string[] }) => 
    apiClient.post('/blindBox/addAccount', data),
  // New endpoint for uploading file to blind box
  uploadBlindBoxFile: (blindBoxId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/blindBox/upload?blindBoxId=${blindBoxId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Order APIs
export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  create: (data: any) => apiClient.post('/orders', data),
};

// Payment webhook
export const paymentAPI = {
  sepayWebhook: (authorization: string, data: any) => 
    apiClient.post('/hooks/sepay-payment', data, {
      headers: {
        'Authorization': authorization,
      },
    }),
};

// Character Skin APIs
export const characterSkinAPI = {
  getAll: (params?: { 
    page?: number; 
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get(`/characterSkin${queryString ? `?${queryString}` : ''}`);
  },
};

export default apiClient;