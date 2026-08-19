import { User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Vance',
    email: 'demo@nexoratrade.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    role: 'user',
    status: 'active',
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Chief Administrator',
    email: 'admin@nexoratrade.com',
    phone: '+1 (555) 999-0000',
    country: 'United Kingdom',
    role: 'admin',
    status: 'active',
    createdAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'user-sample-2',
    name: 'Marcus Sterling',
    email: 'marcus.s@example.com',
    phone: '+44 20 7946 0912',
    country: 'United Kingdom',
    role: 'user',
    status: 'active',
    createdAt: '2025-02-10T14:20:00Z',
  },
  {
    id: 'user-sample-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+49 30 123456',
    country: 'Germany',
    role: 'user',
    status: 'suspended',
    createdAt: '2025-02-18T10:15:00Z',
  },
];
