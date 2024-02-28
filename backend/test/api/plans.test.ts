import { testRoute } from './common.js';
import type { Plan } from '@prisma/client';

const mockPlans: Plan[] = [
  {
    planId: '1',
    clientId: '1',
    coachId: '1',
    Status: 'upcoming'
  },
  {
    planId: '2',
    clientId: '2',
    coachId: '2',
    Status: 'complete'
  }
];
const plan = {
  planId: '3',
  clientId: '3',
  coachId: '3',
  Status: 'cancelled'
};

// /plans/all
testRoute({
  reqData: {},
  mockData: mockPlans,
  expectData: {
    status: 200,
    body: mockPlans
  },
  model: 'plan',
  route: 'all'
});

// /plans/:id
testRoute({
  reqData: {},
  mockData: mockPlans.filter((plan) => plan.planId === '1'),
  expectData: {
    status: 200,
    body: mockPlans.filter((plan) => plan.planId === '1'),
    calledWith: {
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '1'
});

// /plans/search
testRoute({
  reqData: {
    Status: 'complete'
  },
  mockData: mockPlans.filter((plan) => plan.Status === 'complete'),
  expectData: {
    status: 200,
    body: mockPlans.filter((plan) => plan.Status === 'complete'),
    calledWith: {
      where: {
        Status: 'complete'
      }
    }
  },
  model: 'plan',
  route: 'search'
});

// /plans/create
testRoute({
  reqData: {
    ...plan
  },
  mockData: plan,
  expectData: {
    status: 200,
    body: plan,
    calledWith: {
      data: {
        client: { connect: { userId: plan.clientId } },
        coach: { connect: { userId: plan.coachId } },
        Status: plan.Status
      }
    }
  },
  model: 'plan',
  route: 'create'
});

// /plans/update
testRoute({
  reqData: {
    ...plan
  },
  mockData: plan,
  expectData: {
    status: 200,
    body: plan,
    calledWith: {
      data: {
        ...plan
      },
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '1',
  route: 'update'
});

// /plans/delete
testRoute({
  reqData: {},
  mockData: plan,
  expectData: {
    status: 200,
    body: plan,
    calledWith: {
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '1',
  route: 'delete'
});
