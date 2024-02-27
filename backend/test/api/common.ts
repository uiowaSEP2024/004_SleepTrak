import { jest, describe, test, expect } from '@jest/globals';
import request from 'supertest';
import { prisma as prismaMock } from '../../prisma/client.js';
import prismaSpy from '../prismaSpy.test.js';
// import authSpy from '../authSpy.test.js';

jest.unstable_mockModule('../../src/services/auth.js', () => ({
  auth: {
    requireAuth: jest
      .fn()
      .mockImplementation(
        (_req: unknown, _res: unknown, next: (...args: unknown[]) => unknown) =>
          next()
      )
  }
}));

// use dynamic import after for oauth mocks to work
const app = (await import('../../src/app.js')).default;

export interface testRouteParams {
  reqData: object;
  mockData: object;
  expectData: {
    status: number;
    body: object;
    calledWith: object;
  };
  model: string;
  id?: string;
  route?: string;
}

function generateController(model: string): string {
  if (model === 'baby') {
    model = 'babie';
  }
  return model + 's';
}

function generateURL(controller: string, id?: string, route?: string): string {
  if (controller && id && route) {
    return `/${controller}/:id/${route}`;
  }
  if (controller && id) {
    return `/${controller}/:id`;
  }
  if (controller && route) {
    return `/${controller}/${route}`;
  }
  return `/${controller}/all`;
}

// model should be the singular form
export function testRoute({
  reqData,
  mockData,
  expectData,
  model,
  id,
  route
}: testRouteParams): void {
  const controller = generateController(model);
  const url = generateURL(controller, id, route);
  describe(`Test ${url} route`, () => {
    test(`GET ${url} returns ${route} ${id} ${controller}`, async () => {
      prismaSpy[controller][route].mockResolvedValue(mockData);
      const response = await request(app).get(url).send(reqData);
      expect(response.statusCode).toBe(expectData.status);
      expect(response.body).toEqual(expectData.body);
      expect(prismaMock[controller][route]).toHaveBeenCalledWith(
        expectData.calledWith
      );
    });
  });
}
