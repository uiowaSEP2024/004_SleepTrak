const { prismaMock } = require('./mock_client');
const service = require('../src/services/users');

// Testing services

test('should create new user ', async () => {
  const user = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test@email.js',
    role: 'coach'
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(service.create(user)).resolves.toEqual(user);
});

// Testing Controllers
