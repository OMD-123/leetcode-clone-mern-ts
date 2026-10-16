export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  starterCode: string;
  testCases: Array<{ input: string; expected: string }>;
}

export interface Submission {
  _id: string;
  problem: { _id: string; title: string; difficulty: string } | null;
  language: string;
  runtimeMs: number;
  status: string;
  createdAt: string;
  testResults: Array<{
    input: string;
    expected: string;
    actual: string | null;
    passed: boolean;
  }>;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: { id: string; username: string; email: string };
  token: string;
}
