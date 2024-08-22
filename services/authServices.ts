import { User } from '@/components/signup/SignUpTab';
import axios from 'axios';
import { getToken } from './tokenServices';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URI;

//signup
export const signUp = async (data: User): Promise<{ accessToken: string }> => {
  const response = await axios.post(`${baseUrl}/signup`, data);
  return response.data;
};

//login
export interface LogIn {
  email: string;
  password: string;
}

export const logIn = async (data: LogIn): Promise<{ accessToken: string }> => {
  const response = await axios.post(`${baseUrl}/login`, data);
  return response.data;
};

//get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get(`${baseUrl}/getLoggedInUser`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
