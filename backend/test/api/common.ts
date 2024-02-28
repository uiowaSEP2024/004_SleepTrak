import { jest, describe, test, expect } from '@jest/globals';
import request from 'supertest';
import prismaSpy from '../prismaSpy.js';

// unstable_mockModule for esm module mocking compatibility
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
    calledWith?: object;
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
    test(`GET ${url} returns as expected`, async () => {
      if (!route) {
        route = 'get';
      }
      prismaSpy[controller][route].mockResolvedValue(mockData);
      const response = await request(app).get(url).send(reqData);

      expect(response.statusCode).toBe(expectData.status);
      expect(response.body).toEqual(expectData.body);
      expect(prismaSpy[controller][route]).toHaveBeenCalled();
      if (!expectData.calledWith) {
        // this expect is matched with an expect in the else, and will not cause fragility
        // eslint-disable-next-line jest/no-conditional-expect
        expect(prismaSpy[controller][route]).toHaveBeenCalledWith();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(prismaSpy[controller][route]).toHaveBeenCalledWith(
          expectData.calledWith
        );
      }
    });
  });
}
