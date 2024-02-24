import request from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../mock_client';

const mockPlans = [
  {
    planId: 1,
    Status: 'upcoming'
  },
  {
    planId: 2,
    Status: 'complete'
  }
];
const plan = {
  planId: 3,
  Status: 'cancelled'
};

describe('Test /plans/all route', () => {
  test('GET /plans returns all plans', async () => {
    prismaMock.plan.findMany.mockReturnValue(mockPlans);
    const response = await request(app).get('/plans/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockPlans);
    expect(prismaMock.plan.findMany).toHaveBeenCalledWith();
  });
});

describe('test /plans/:id route', () => {
  test('GET /plans/:id calls findUnique and returns plan', async () => {
    const tid = 3;
    prismaMock.plan.findUnique.mockReturnValue(
      mockPlans.filter((plans) => plans.planId === tid)
    );
    const response = await request(app).get('/plans/{tid}');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockPlans.filter((plans) => plans.planId === tid)
    );
    response.body.forEach((plan: any) => {
      expect(plan.planId).toEqual(tid);
    });
    expect(prismaMock.plan.findUnique).toHaveBeenCalledWith({
      where: { planId: '{tid}' }
    });
  });
});

describe('test /plans/search route', () => {
  test('GET /plans/search calls findMany and returns plans', async () => {
    const status = 'complete';
    prismaMock.plan.findMany.mockReturnValue(
      mockPlans.filter((plan) => plan.Status === status)
    );
    const response = await request(app).get('/plans/search');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockPlans.filter((plan) => plan.Status === status)
    );
    response.body.forEach((plan: any) => {
      expect(plan.role).toEqual(status);
    });
    expect(prismaMock.plan.findMany).toHaveBeenCalledWith({ where: {} });
  });
});

describe('test /plans/create route', () => {
  test('POST /plans/create calls create and returns plan', async () => {
    prismaMock.plan.create.mockReturnValue(plan);
    const response = await request(app).post('/plans/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(plan);
  });
});

describe('test /plans/:id/update route', () => {
  test('PUT /plans/:id/update calls update and returns plan', async () => {
    prismaMock.plan.update.mockReturnValue(plan);
    const response = await request(app)
      .put('/plans/4/update')
      .send({ first_name: 'Update' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(plan);
    expect(prismaMock.plan.update).toHaveBeenCalledWith({
      data: {
        first_name: 'Update'
      },
      where: { planId: '4' }
    });
  });
});

describe('test /plans/:id/delete route', () => {
  test('PUT /plans/:id/delete calls delete and returns delete info', async () => {
    prismaMock.plan.delete.mockReturnValue(plan);
    const response = await request(app).delete('/plans/4/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(plan);
    expect(prismaMock.plan.delete).toHaveBeenCalledWith({
      where: { planId: '4' }
    });
  });
});
