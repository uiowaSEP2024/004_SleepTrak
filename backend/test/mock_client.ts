import { jest } from '@jest/globals';
import { mockDeep, mockReset } from 'jest-mock-extended';
import type { PrismaClient } from '@prisma/client/extension';

const prismaMock = mockDeep<PrismaClient>();
// Mocking '../prisma/client' with prismaMock
jest.mock('../prisma/client.js', () => {
  return {
    __esModule: true,
    prisma: mockDeep<PrismaClient>()
  };
});

// Reset the mock before each test
beforeEach(async () => {
  mockReset(prismaMock);
});

export { prismaMock };
