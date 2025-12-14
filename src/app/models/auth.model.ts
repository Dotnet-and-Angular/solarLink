// User and Authentication Models
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  organizationId?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = 'customer' | 'technician' | 'installer' | 'admin';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  customer: [
    'view_own_systems',
    'view_own_production',
    'view_own_savings',
    'create_ticket',
    'view_own_tickets',
  ],
  technician: [
    'view_assigned_systems',
    'update_ticket',
    'view_tickets',
    'view_inventory',
    'create_service_log',
  ],
  installer: [
    'view_all_systems',
    'create_system',
    'update_system',
    'view_all_clients',
    'manage_inventory',
  ],
  admin: [
    'view_all_systems',
    'view_all_clients',
    'manage_users',
    'manage_tickets',
    'view_analytics',
    'manage_roles',
    'manage_inventory',
    'export_data',
  ],
};
