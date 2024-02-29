import { testRoute } from './common.js';
import type { User } from '@prisma/client';

const mockUsers: User[] = [
  {
    userId: '1',
    first_name: 'Dylan',
    last_name: 'Laurianti',
    email: 'dlaurianti@uiowa.edu',
    coachId: null,
    role: 'coach'
  },
  {
    userId: '2',
    first_name: 'Sergio',
    last_name: 'Martelo',
    email: 'smartelo@uiowa.edu',
    coachId: '1',
    role: 'client'
  }
];
const user = {
  userId: '3',
  first_name: 'Haruko',
  last_name: 'Okada',
  email: 'hokada@uiowa.edu',
  coachId: '1',
  role: 'client'
};

// Happy Path Tests
// ============================================================================

// /users/all
testRoute({
  description: 'returns all users',
  reqData: {},
  mockData: mockUsers,
  expectData: {
    status: 200,
    body: mockUsers
  },
  model: 'user',
  route: 'all'
});

// /users/:id
testRoute({
  description: 'returns user matching :id',
  reqData: {},
  mockData: mockUsers.filter((user) => user.userId === '1'),
  expectData: {
    status: 200,
    body: mockUsers.filter((user) => user.userId === '1'),
    calledWith: {
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '1'
});

// /users/search
testRoute({
  description: 'returns user matching search by role',
  reqData: {
    role: 'client'
  },
  mockData: mockUsers.filter((user) => user.role === 'client'),
  expectData: {
    status: 200,
    body: mockUsers.filter((user) => user.role === 'client'),
    calledWith: {
      where: {
        role: 'client'
      }
    }
  },
  model: 'user',
  route: 'search'
});

// /users/create
const { userId: _u, coachId: _c, ...userProps } = user;
testRoute({
  description: 'returns created user',
  reqData: {
    ...user
  },
  mockData: user,
  expectData: {
    status: 200,
    body: user,
    calledWith: {
      data: {
        ...userProps,
        coach: { connect: { userId: user.coachId } }
      }
    }
  },
  model: 'user',
  route: 'create'
});

// /users/update
testRoute({
  description: 'returns updated user',
  reqData: {
    ...user
  },
  mockData: user,
  expectData: {
    status: 200,
    body: user,
    calledWith: {
      data: {
        ...user
      },
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '1',
  route: 'update'
});

// /users/delete
testRoute({
  description: 'returns deleted user',
  reqData: {},
  mockData: user,
  expectData: {
    status: 200,
    body: user,
    calledWith: {
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '1',
  route: 'delete'
});
// Sad Path Tests
// ============================================================================

// /users/all
testRoute({
  description: 'returns no users if there are none',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {}
  },
  model: 'user',
  route: 'all'
});

// /users/:id
testRoute({
  description: 'returns nothing if no user matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '5'
});

// /users/search
testRoute({
  description: 'returns nothing if no users match searched role',
  reqData: {
    role: 'admin'
  },
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        role: 'admin'
      }
    }
  },
  model: 'user',
  route: 'search'
});

// /users/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        role: undefined
      }
    }
  },
  model: 'user',
  route: 'create'
});

// /users/update
testRoute({
  description: 'returns unupdated user if no data passed',
  reqData: {},
  mockData: user,
  expectData: {
    status: 200,
    body: user,
    calledWith: {
      data: {},
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '1',
  route: 'update'
});

// /users/delete
testRoute({
  description: 'returns nothing if no user matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        userId: ':id'
      }
    }
  },
  model: 'user',
  id: '5',
  route: 'delete'
});
