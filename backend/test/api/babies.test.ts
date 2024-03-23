import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';

const mockBabys = [
  {
    babyId: '1',
    parentId: '1',
    name: 'Mingi',
    dob: '2022-01-01',
    weight: 12,
    medicine: 'vitamin c'
  },
  {
    babyId: '2',
    parentId: '2',
    name: 'Matt',
    dob: '2023-06-06',
    weight: 10,
    medicine: 'tylenol'
  }
];
const baby = {
  babyId: '3',
  parentId: '3',
  name: 'Adnane',
  dob: '2021-03-03',
  weight: 8,
  medicine: 'pencillin'
};

// Happy Path Tests
// ============================================================================

// /babys/all
testRoute({
  description: 'returns all babies',
  reqData: {},
  mockData: mockBabys,
  expectData: {
    status: 200,
    body: mockBabys,
    calledWith: {
      include: {
        parent: true
      }
    }
  },
  model: 'baby',
  route: 'all'
});

// /babys/:id
testRoute({
  description: 'returns baby matching :id',
  reqData: {},
  mockData: mockBabys.filter((baby) => baby.babyId === '1'),
  expectData: {
    status: 200,
    body: mockBabys.filter((baby) => baby.babyId === '1'),
    calledWith: {
      include: {
        parent: true
      },
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1'
});

// /babys/search
testRoute({
  description: 'returns babies matching search by medicine',
  reqData: {
    role: 'client'
  },
  mockData: mockBabys.filter((baby) => baby.medicine === 'tylenol'),
  expectData: {
    status: 200,
    body: mockBabys.filter((baby) => baby.medicine === 'tylenol'),
    calledWith: {
      where: {
        role: 'client'
      }
    }
  },
  model: 'baby',
  route: 'search'
});

// /babys/create
const { parentId: _p, ...babyProps } = baby;
testRoute({
  description: 'returns created baby',
  reqData: {
    ...baby
  },
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      data: {
        ...babyProps,
        dob: new Date(baby.dob),
        parent: { connect: { userId: baby.parentId } }
      }
    }
  },
  model: 'baby',
  route: 'create'
});

// /babys/update
testRoute({
  description: 'returns updated baby',
  reqData: {
    ...baby
  },
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      data: {
        ...baby
      },
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'update'
});

// /babys/delete
testRoute({
  description: 'returns deleted baby',
  reqData: {},
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'delete'
});

// Sad Path Tests
// ============================================================================

// /babys/all
testRoute({
  description: 'returns no babys if there are none',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      include: {
        parent: true
      }
    }
  },
  model: 'baby',
  route: 'all'
});

// /babys/:id
testRoute({
  description: 'returns nothing if no baby matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      include: {
        parent: true
      },
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '5'
});

// /babys/search
testRoute({
  description: 'returns nothing if no babys match searched weight',
  reqData: {
    weight: 100
  },
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        weight: 100
      }
    }
  },
  model: 'baby',
  route: 'search'
});

// /babys/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        parent: { connect: { userId: undefined } },
        name: undefined,
        dob: null,
        weight: null,
        medicine: null,
        babyId: undefined
      }
    }
  },
  model: 'baby',
  route: 'create'
});

// /babys/update
testRoute({
  description: 'returns unupdated baby if no data passed',
  reqData: {},
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      data: {},
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'update'
});

// /babys/delete
testRoute({
  description: 'returns nothing if no baby matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
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
// /babys/all
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
      include: {
        parent: true
      }
    }
  },
  model: 'baby',
  route: 'all'
});

// /babys/:id
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
      include: {
        parent: true
      },
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1'
});

// /babys/search
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
  model: 'baby',
  route: 'search'
});

// /babys/create
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
        parent: { connect: { userId: undefined } },
        name: undefined,
        dob: null,
        weight: null,
        medicine: null,
        babyId: undefined
      }
    }
  },
  model: 'baby',
  route: 'create'
});

// /babys/update
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
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'update'
});

// /babys/delete
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
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'delete'
});
