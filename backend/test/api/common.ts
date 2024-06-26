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

type Callback = () => void;

export interface testRouteParams {
  description: string;
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
  before?: Callback;
  after?: Callback;
}

function generateController(model: string): string {
  if (model === 'baby') {
    model = 'babie';
  }
  return model + 's';
}

function generateHTTPMethod(route: string): string {
  if (
    route === 'get' ||
    route === 'all' ||
    route === 'search' ||
    route === 'user'
  ) {
    return 'get';
  } else if (route === 'create') {
    return 'post';
  } else if (route === 'update') {
    return 'put';
  } else if (route === 'delete') {
    return 'delete';
  }
  throw new URIError();
}

function generateURL(controller: string, id?: string, route?: string): string {
  if (controller && id && route) {
    if (route === 'user') {
      return `/${controller}/${route}/:id`;
    } else {
      return `/${controller}/:id/${route}`;
    }
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
  description,
  reqData,
  mockData,
  expectData,
  model,
  id,
  route,
  before = () => {},
  after = () => {}
}: testRouteParams): void {
  const controller = generateController(model);
  const url = generateURL(controller, id, route);
  describe(`Test ${url} route, controller, service, bypassing oauth & prisma`, () => {
    test(`GET ${url} ${description}`, async () => {
      before();
      if (!route) {
        route = 'get';
      }
      if (mockData instanceof Error) {
        prismaSpy[controller][route].mockRejectedValue(mockData);
      } else {
        prismaSpy[controller][route].mockResolvedValue(mockData);
      }

      const httpMethod = generateHTTPMethod(route);
      const response = await request(app)[httpMethod](url).send(reqData);

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
        after();
      }
    });
  });
}
