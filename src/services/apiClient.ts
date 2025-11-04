import axios, { AxiosInstance } from 'axios';
import { TimeChangesResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.dummy.in-lotion.de';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchTimeChanges(): Promise<TimeChangesResponse> {
    try {
      const response = await this.client.get<TimeChangesResponse>(
        '/api/time-changes'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API Error: ${error.response?.status} - ${error.message}`
        );
      }
      throw error;
    }
  }

  setBaseURL(url: string): void {
    this.client.defaults.baseURL = url;
  }

  getBaseURL(): string {
    return this.client.defaults.baseURL || BASE_URL;
  }
}

export const apiClient = new ApiClient();