export const usersSeed = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Normal User',
    email: 'user@example.com',
    password: 'user123',
    // no role → should default to 'user'
  },
];
