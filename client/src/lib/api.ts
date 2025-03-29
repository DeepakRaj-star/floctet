import axios from "axios";

export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  config?: any
) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const register = async (data: { name: string; email: string; password: string }) => {
  const username = data.email.split('@')[0];
  return apiRequest('POST', '/api/auth/register', {
    ...data,
    username,
    role: 'user'
  });
};

export const login = async (data: { email: string; password: string }) => {
  return apiRequest('POST', '/api/auth/login', {
    username: data.email,
    password: data.password
  });
};

export const loginAdmin = async (username: string, password: string) => {
  return apiRequest('POST', '/api/auth/login', { username, password });
};

export const getServiceRequests = async () => {
  return apiRequest('GET', '/api/service-requests');
};

export const updateServiceRequestStatus = async (id: number, status: string) => {
  return apiRequest('PATCH', `/api/service-requests/${id}/status`, { status });
};