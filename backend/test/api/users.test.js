const request = require('supertest');
const app = require('../../src/app');
const { prismaMock } = require('../mock_client');

describe('Test /users/all route', () => {
  const mockUsers = [
    {
      id: 1,
      first_name: 'Dylan',
      last_name: 'Laurianti',
      email: 'dl@email.js',
      role: 'owner'
    },
    {
      id: 2,
      first_name: 'Sergio',
      last_name: 'Martelo',
      email: 'sm@email.js',
      role: 'client'
    },
    {
      id: 3,
      first_name: 'Haruko',
      last_name: 'Okada',
      email: 'ho@email.js',
      role: 'coach'
    },
    {
      id: 4,
      first_name: 'Mingi',
      last_name: 'Lee',
      email: 'ml@email.js',
      role: 'client'
    }
  ];
  test('it should respond to GET method', async () => {
    prismaMock.user.findMany.mockReturnValue(mockUsers);
    const response = await request(app).get('/users/all');
    expect(response.statusCode).toBe(200);
  });
});
