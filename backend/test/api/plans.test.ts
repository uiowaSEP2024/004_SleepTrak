import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';
import type { Plan } from '@prisma/client';

const mockPlans: Plan[] = [
  {
    planId: '1',
    clientId: '1',
    coachId: '1'
  },
  {
    planId: '2',
    clientId: '2',
    coachId: '2'
  }
];
const plan = {
  planId: '3',
  clientId: '3',
  coachId: '3'
};

// Happy Path Tests
// ============================================================================
// /plans/all
testRoute({
  description: 'returns all plans',
  reqData: {},
  mockData: mockPlans,
  expectData: {
    status: 200,
    body: mockPlans,
    calledWith: { include: { reminders: { orderBy: { startTime: 'asc' } } } }
  },
  model: 'plan',
  route: 'all'
});

// /plans/:id
testRoute({
  description: 'returns plan matching :id',
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

// /plans/create
const { planId: _p, clientId: _cl, coachId: _co, ...planProps } = plan;
testRoute({
  description: 'returns created plan',
  reqData: {
    ...plan
  },
  mockData: plan,
  expectData: {
    status: 200,
    body: plan,
    calledWith: {
      data: {
        ...planProps,
        client: { connect: { userId: plan.clientId } },
        coach: { connect: { userId: plan.coachId } },
        reminders: { create: undefined }
      }
    }
  },
  model: 'plan',
  route: 'create'
});

// /plans/update
testRoute({
  description: 'returns updated  plan',
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
  description: 'returns deleted plan',
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

// Sad Path Tests
// ============================================================================

// /plans/all
testRoute({
  description: 'returns no plans if there are none',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: { include: { reminders: { orderBy: { startTime: 'asc' } } } }
  },
  model: 'plan',
  route: 'all'
});

// /plans/:id
testRoute({
  description: 'returns nothing if no plan matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '5'
});

// /plans/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        client: { connect: { userId: undefined } },
        coach: { connect: { coachId: undefined } },
        reminders: { create: undefined }
      }
    }
  },
  model: 'plan',
  route: 'create'
});

// /plans/update
testRoute({
  description: 'returns unupdated plan if no data passed',
  reqData: {},
  mockData: plan,
  expectData: {
    status: 200,
    body: plan,
    calledWith: {
      data: {},
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
  description: 'returns nothing if no plan matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '5',
  route: 'delete'
});

// Error Path Tests
// ============================================================================

const prismaError = new PrismaClientKnownRequestError(
  'Error manually generated for testing',
  {
    code: 'P2010',
    clientVersion: 'jest mock'
  }
);
// /plans/all
testRoute({
  description: 'returns HTTP 500 if Prisma throws error',
  reqData: {},
  mockData: prismaError,
  expectData: {
    status: 500,
    body: {
      name: prismaError.name,
      code: prismaError.code,
      clientVersion: prismaError.clientVersion
    },
    calledWith: { include: { reminders: { orderBy: { startTime: 'asc' } } } }
  },
  model: 'plan',
  route: 'all'
});

// /plans/:id
testRoute({
  description: 'returns HTTP 500 if Prisma throws error',
  reqData: {},
  mockData: prismaError,
  expectData: {
    status: 500,
    body: {
      name: prismaError.name,
      code: prismaError.code,
      clientVersion: prismaError.clientVersion
    },
    calledWith: {
      where: {
        planId: ':id'
      }
    }
  },
  model: 'plan',
  id: '1'
});

// /plans/create
testRoute({
  description: 'returns HTTP 500 if Prisma throws error',
  reqData: {},
  mockData: prismaError,
  expectData: {
    status: 500,
    body: {
      name: prismaError.name,
      code: prismaError.code,
      clientVersion: prismaError.clientVersion
    },
    calledWith: {
      data: {
        client: { connect: { userId: undefined } },
        coach: { connect: { userId: undefined } },
        reminders: { create: undefined }
      }
    }
  },
  model: 'plan',
  route: 'create'
});

// /plans/update
testRoute({
  description: 'returns HTTP 500 if Prisma throws error',
  reqData: {},
  mockData: prismaError,
  expectData: {
    status: 500,
    body: {
      name: prismaError.name,
      code: prismaError.code,
      clientVersion: prismaError.clientVersion
    },
    calledWith: {
      data: {},
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
  description: 'returns HTTP 500 if Prisma throws error',
  reqData: {},
  mockData: prismaError,
  expectData: {
    status: 500,
    body: {
      name: prismaError.name,
      code: prismaError.code,
      clientVersion: prismaError.clientVersion
    },
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
