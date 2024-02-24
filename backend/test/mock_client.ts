import { mockDeep, mockReset } from 'jest-mock-extended';

// Mocking '../prisma/client' with prismaMock
jest.mock('../prisma/client', () => {
  const prismaMock = mockDeep();
  return {
    __esModule: true,
    prisma: prismaMock,
    user: {
      findMany: jest.fn()
    }
  };
});

// Reset the mock before each test
beforeEach(() => {
  const { prisma } = require('../prisma/client'); // Requiring inside beforeEach to get the latest mock
  mockReset(prisma);
});

// Exporting prismaMock
export const prismaMock = require('../prisma/client').prisma;
