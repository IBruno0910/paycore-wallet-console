export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  companyId?: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};