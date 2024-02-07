const { prismaMock } = require('./mock_client');
const service = require('../src/services/users');

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

// test('should update a users first name ', async () => {
//   const user = {
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true
//   };

//   prismaMock.user.update.mockResolvedValue(user);

//   await expect(updateUsername(user)).resolves.toEqual({
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true
//   });
// });
