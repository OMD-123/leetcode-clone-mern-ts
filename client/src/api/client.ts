import { AuthResponse, Problem, Submission, User } from '../types';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('lc_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: { ...this.getHeaders(), ...(options.headers || {}) },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data as T;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  }

  async getProblems(): Promise<Problem[]> {
    return this.request('/problems');
  }

  async getProblem(id: string): Promise<Problem> {
    return this.request(`/problems/${id}`);
  }

  async createProblem(problem: Partial<Problem>): Promise<Problem> {
    return this.request('/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  }

  async submitSolution(problemId: string, code: string, language: string): Promise<Submission> {
    return this.request('/submissions/submit', {
      method: 'POST',
      body: JSON.stringify({ problemId, code, language }),
    });
  }

  async getMySubmissions(): Promise<Submission[]> {
    return this.request('/submissions/my');
  }
}

export const api = new ApiClient();
