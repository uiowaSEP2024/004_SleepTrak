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

const request = require('supertest');
const app = require('../../src/app');
const { prismaMock } = require('../mock_client');

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
const user = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@email.js',
  role: 'coach'
};

describe('Test /users/all route', () => {
  test('GET /users returns all users', async () => {
    prismaMock.user.findMany.mockReturnValue(mockUsers);
    const response = await request(app).get('/users/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith();
  });
});

describe('test /users/:id route', () => {
  test('GET /users/:id calls findUnique and returns user', async () => {
    const tid = 3;
    prismaMock.user.findUnique.mockReturnValue(
      mockUsers.filter((users) => users.id === tid)
    );
    const response = await request(app).get('/users/{tid}');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockUsers.filter((users) => users.id === tid)
    );
    response.body.forEach((user) => expect(user.id).toEqual(tid));
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { userId: '{tid}' }
    });
  });
});

describe('test /users/search route', () => {
  test('GET /users/search calls findMany and returns users', async () => {
    const role = 'client';
    prismaMock.user.findMany.mockReturnValue(
      mockUsers.filter((user) => user.role === role)
    );
    const response = await request(app).get('/users/search');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockUsers.filter((user) => user.role === role)
    );
    response.body.forEach((user) => expect(user.role).toEqual(role));
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({ where: {} });
  });
});

describe('test /users/create route', () => {
  test('POST /users/create calls create and returns user', async () => {
    prismaMock.user.create.mockReturnValue(user);
    const response = await request(app).post('/users/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });
});

describe('test /users/:id/update route', () => {
  test('PUT /users/:id/update calls update and returns user', async () => {
    prismaMock.user.update.mockReturnValue(user);
    const response = await request(app)
      .put('/users/4/update')
      .send({ first_name: 'Update' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      data: {
        first_name: 'Update'
      },
      where: { userId: '4' }
    });
  });
});

describe('test /users/:id/delete route', () => {
  test('PUT /users/:id/delete calls delete and returns delete info', async () => {
    prismaMock.user.delete.mockReturnValue(user);
    const response = await request(app).delete('/users/4/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { userId: '4' }
    });
  });
});
