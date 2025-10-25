export interface User {
  id: number;
  email: string;
  roles: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  roles: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    roles: string;
    token: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

// Error response types
export interface ApiErrorResponse {
  status: number;
  data: {
    message: string;
  };
}

export interface FetchBaseQueryError {
  status: number;
  data: unknown;
}
