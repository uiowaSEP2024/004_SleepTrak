import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';

const mockEvents = [
  {
    eventId: '1',
    ownerId: '1',
    startTime: '2022-01-01T12:00:00.000Z',
    endTime: '2022-01-01T13:00:00.000Z',
    type: 'nap',
    amount: null,
    foodType: null,
    unit: null,
    note: null,
    medicineType: null
  },
  {
    eventId: '2',
    ownerId: '2',
    startTime: '2023-01-01T12:00:00.000Z',
    endTime: '2023-01-01T13:00:00.000Z',
    type: 'sleep',
    amount: null,
    foodType: null,
    unit: null,
    note: null,
    medicineType: null
  }
];
const event = {
  eventId: '3',
  ownerId: '3',
  startTime: '2024-01-01T12:00:00.000Z',
  endTime: '2024-01-01T13:00:00.000Z',
  type: 'wake',
  amount: null,
  foodType: null,
  unit: null,
  note: null,
  medicineType: null
};

// Happy Path Tests
// ============================================================================

// /events/all
testRoute({
  description: 'returns all events',
  reqData: {},
  mockData: mockEvents,
  expectData: {
    status: 200,
    body: mockEvents
  },
  model: 'event',
  route: 'all'
});

// /events/:id
testRoute({
  description: 'returns event matching :id',
  reqData: {},
  mockData: mockEvents.filter((event) => event.eventId === '1'),
  expectData: {
    status: 200,
    body: mockEvents.filter((event) => event.eventId === '1'),
    calledWith: {
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1'
});

// /events/search
testRoute({
  description: 'returns events matching search by type',
  reqData: {
    role: 'client'
  },
  mockData: mockEvents.filter((event) => event.type === 'nap'),
  expectData: {
    status: 200,
    body: mockEvents.filter((event) => event.type === 'nap'),
    calledWith: {
      where: {
        role: 'client'
      }
    }
  },
  model: 'event',
  route: 'search'
});

// /events/create
const { eventId: _e, ownerId: _o, ...eventProps } = event;
testRoute({
  description: 'returns created event',
  reqData: {
    ...event
  },
  mockData: event,
  expectData: {
    status: 200,
    body: event,
    calledWith: {
      data: {
        ...eventProps,
        startTime: new Date(event.startTime).toISOString(),
        endTime: new Date(event.endTime).toISOString(),
        owner: { connect: { userId: event.ownerId } }
      }
    }
  },
  model: 'event',
  route: 'create'
});

// /events/update
testRoute({
  description: 'returns updated event',
  reqData: {
    ...event
  },
  mockData: event,
  expectData: {
    status: 200,
    body: event,
    calledWith: {
      data: {
        ...event
      },
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1',
  route: 'update'
});

// /events/delete
testRoute({
  description: 'returns deleted event',
  reqData: {},
  mockData: event,
  expectData: {
    status: 200,
    body: event,
    calledWith: {
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1',
  route: 'delete'
});

// Sad Path Tests
// ============================================================================

// /events/all
testRoute({
  description: 'returns no events if there are none',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {}
  },
  model: 'event',
  route: 'all'
});

// /events/:id
testRoute({
  description: 'returns nothing if no event matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '5'
});

// /events/search
testRoute({
  description: 'returns nothing if no events match searched role',
  reqData: {
    type: 'nap'
  },
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        type: 'nap'
      }
    }
  },
  model: 'event',
  route: 'search'
});

// /events/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        owner: { connect: { userId: undefined } },
        startTime: undefined,
        endTime: undefined,
        type: undefined,
        amount: null,
        foodType: null,
        unit: null,
        note: null,
        medicineType: null
      }
    }
  },
  model: 'event',
  route: 'create'
});

// /events/update
testRoute({
  description: 'returns unupdated event if no data passed',
  reqData: {},
  mockData: event,
  expectData: {
    status: 200,
    body: event,
    calledWith: {
      data: {},
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1',
  route: 'update'
});

// /events/delete
testRoute({
  description: 'returns nothing if no event matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '5',
  route: 'delete'
});

// /events/user/:userId
testRoute({
  description: 'return events matching :od',
  reqData: {},
  mockData: mockEvents.filter((event) => event.ownerId === '1'),
  expectData: {
    status: 200,
    body: mockEvents.filter((event) => event.ownerId === '1'),
    calledWith: {
      where: {
        ownerId: ':id'
      }
    }
  },
  model: 'event',
  route: 'user',
  id: '1'
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
// /events/all
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
    }
  },
  model: 'event',
  route: 'all'
});

// /events/:id
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
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1'
});

// /events/search
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
      where: {}
    }
  },
  model: 'event',
  route: 'search'
});

// /events/create
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
        owner: { connect: { userId: undefined } },
        startTime: undefined,
        endTime: undefined,
        type: undefined,
        amount: null,
        foodType: null,
        unit: null,
        note: null,
        medicineType: null
      }
    }
  },
  model: 'event',
  route: 'create'
});

// /events/update
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
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1',
  route: 'update'
});

// /events/delete
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
        eventId: ':id'
      }
    }
  },
  model: 'event',
  id: '1',
  route: 'delete'
});

// /events/user/:userId
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
        ownerId: ':id'
      }
    }
  },
  model: 'event',
  route: 'user',
  id: '1'
});
