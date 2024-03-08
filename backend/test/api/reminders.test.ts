import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';

const mockReminders = [
  {
    reminderId: '1',
    planId: '1',
    description: 'nap',
    timestamp: '2022-01-01T12:00:00Z'
  },
  {
    reminderId: '2',
    planId: '2',
    description: 'nap',
    timestamp: '2023-01-01T12:00:00Z'
  }
];
const reminder = {
  reminderId: '3',
  planId: '3',
  description: 'nap',
  timestamp: '2024-01-01T12:00:00Z'
};

// Happy Path Tests
// ============================================================================

// /reminders/all
testRoute({
  description: 'returns all reminders',
  reqData: {},
  mockData: mockReminders,
  expectData: {
    status: 200,
    body: mockReminders
  },
  model: 'reminder',
  route: 'all'
});

// /reminders/:id
testRoute({
  description: 'returns reminder matching :id',
  reqData: {},
  mockData: mockReminders.filter((reminder) => reminder.reminderId === '1'),
  expectData: {
    status: 200,
    body: mockReminders.filter((reminder) => reminder.reminderId === '1'),
    calledWith: {
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1'
});

// /reminders/search
testRoute({
  description: 'returns reminders matching search by description',
  reqData: {
    role: 'client'
  },
  mockData: mockReminders.filter((reminder) => reminder.description === 'nap'),
  expectData: {
    status: 200,
    body: mockReminders.filter((reminder) => reminder.description === 'nap'),
    calledWith: {
      where: {
        role: 'client'
      }
    }
  },
  model: 'reminder',
  route: 'search'
});

// /reminders/create
const { reminderId: _u, planId: _p, ...reminderProps } = reminder;
testRoute({
  description: 'returns created reminder',
  reqData: {
    ...reminder
  },
  mockData: reminder,
  expectData: {
    status: 200,
    body: reminder,
    calledWith: {
      data: {
        ...reminderProps,
        plan: { connect: { planId: reminder.planId } },
        timestamp: new Date(reminder.timestamp)
      }
    }
  },
  model: 'reminder',
  route: 'create'
});

// /reminders/update
testRoute({
  description: 'returns updated reminder',
  reqData: {
    ...reminder
  },
  mockData: reminder,
  expectData: {
    status: 200,
    body: reminder,
    calledWith: {
      data: {
        ...reminder
      },
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1',
  route: 'update'
});

// /reminders/delete
testRoute({
  description: 'returns deleted reminder',
  reqData: {},
  mockData: reminder,
  expectData: {
    status: 200,
    body: reminder,
    calledWith: {
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1',
  route: 'delete'
});

// Sad Path Tests
// ============================================================================

// /reminders/all
testRoute({
  description: 'returns no reminders if there are none',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {}
  },
  model: 'reminder',
  route: 'all'
});

// /reminders/:id
testRoute({
  description: 'returns nothing if no reminder matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '5'
});

// /reminders/search
testRoute({
  description: 'returns nothing if no reminders match searched role',
  reqData: {
    description: 'nap'
  },
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        description: 'nap'
      }
    }
  },
  model: 'reminder',
  route: 'search'
});

// /reminders/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        plan: { connect: { planId: undefined } },
        description: undefined,
        timestamp: null
      }
    }
  },
  model: 'reminder',
  route: 'create'
});

// /reminders/update
testRoute({
  description: 'returns unupdated reminder if no data passed',
  reqData: {},
  mockData: reminder,
  expectData: {
    status: 200,
    body: reminder,
    calledWith: {
      data: {},
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1',
  route: 'update'
});

// /reminders/delete
testRoute({
  description: 'returns nothing if no reminder matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
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
// /reminders/all
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
  model: 'reminder',
  route: 'all'
});

// /reminders/:id
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
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1'
});

// /reminders/search
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
  model: 'reminder',
  route: 'search'
});

// /reminders/create
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
        plan: { connect: { planId: undefined } },
        description: undefined,
        timestamp: null
      }
    }
  },
  model: 'reminder',
  route: 'create'
});

// /reminders/update
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
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1',
  route: 'update'
});

// /reminders/delete
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
        reminderId: ':id'
      }
    }
  },
  model: 'reminder',
  id: '1',
  route: 'delete'
});
