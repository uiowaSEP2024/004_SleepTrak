import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';

const mockFiles = [
  { fileId: '1', filename: 'file1.pdf', url: '/url1', babyId: '1' },
  // { fileId: '1', filename: 'file1.pdf', url: '/url1', babyId: '2' },
  { fileId: '2', filename: 'file2.pdf', url: '/url2', babyId: '1' }
];

const file = {
  fileId: '3',
  filename: 'file3.pdf',
  url: '/url3',
  babyId: '3'
};

// TODO: implement test for create

// Happy Path Tests
// ============================================================================

// /files/:id
testRoute({
  description: 'returns file matching :id',
  reqData: {},
  mockData: mockFiles.filter((file) => file.fileId === '1'),
  expectData: {
    status: 200,
    body: mockFiles.filter((file) => file.fileId === '1'),
    calledWith: {
      where: {
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '1'
});

// /files/search
// testRoute({
//   description: 'returns files matching search by babyId',
//   reqData: {
//     babyId: '1'
//   },
//   mockData: mockFiles.filter((file) => file.babyId === '1'),
//   expectData: {
//     status: 200,
//     body: mockFiles.filter((file) => file.babyId === '1'),
//     calledWith: {
//       where: {
//         babyId: '1'
//       }
//     }
//   },
//   model: 'file',
//   route: 'search'
// });

// // /files/create
// const { fileId: _f, babyId: _b, ...fileProps } = file;
// testRoute({
//   description: 'returns created file',
//   reqData: {
//     ...file
//   },
//   mockData: file,
//   expectData: {
//     status: 200,
//     body: file,
//     calledWith: {
//       data: {
//         ...fileProps,
//         baby: { connect: { babyId: file.babyId } }
//       }
//     }
//   },
//   model: 'file',
//   route: 'create'
// });

// /files/delete
testRoute({
  description: 'returns deleted file',
  reqData: {},
  mockData: file,
  expectData: {
    status: 200,
    body: file,
    calledWith: {
      where: {
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '1',
  route: 'delete'
});

// // Sad Path Tests
// // ============================================================================

// /files/:id
testRoute({
  description: 'returns nothing if no file matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '5'
});

// // /files/search
// testRoute({
//   description: 'returns nothing if no files match searched role',
//   reqData: {
//     type: 'nap'
//   },
//   mockData: {},
//   expectData: {
//     status: 200,
//     body: {},
//     calledWith: {
//       where: {
//         type: 'nap'
//       }
//     }
//   },
//   model: 'file',
//   route: 'search'
// });

// // /files/create
// testRoute({
//   description: 'returns empty object when no data passed',
//   reqData: {},
//   mockData: {},
//   expectData: {
//     status: 200,
//     body: {},
//     calledWith: {
//       data: {
//         owner: { connect: { userId: undefined } },
//         startTime: undefined,
//         endTime: undefined,
//         type: undefined,
//         amount: null,
//         foodType: null,
//         unit: null,
//         note: null,
//         medicineType: null
//       }
//     }
//   },
//   model: 'file',
//   route: 'create'
// });

// /files/delete
testRoute({
  description: 'returns nothing if no file matches :id',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '5',
  route: 'delete'
});

// // Error Path Tests
// // ============================================================================

const prismaError = new PrismaClientKnownRequestError(
  'Error manually generated for testing',
  {
    code: 'P2010',
    clientVersion: 'jest mock'
  }
);

// /files/:id
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
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '1'
});

// // /files/search
// testRoute({
//   description: 'returns HTTP 500 if Prisma throws error',
//   reqData: {},
//   mockData: prismaError,
//   expectData: {
//     status: 500,
//     body: {
//       name: prismaError.name,
//       code: prismaError.code,
//       clientVersion: prismaError.clientVersion
//     },
//     calledWith: {
//       where: {}
//     }
//   },
//   model: 'file',
//   route: 'search'
// });

// // /files/create
// testRoute({
//   description: 'returns HTTP 500 if Prisma throws error',
//   reqData: {},
//   mockData: prismaError,
//   expectData: {
//     status: 500,
//     body: {
//       name: prismaError.name,
//       code: prismaError.code,
//       clientVersion: prismaError.clientVersion
//     },
//     calledWith: {
//       data: {
//         owner: { connect: { userId: undefined } },
//         startTime: undefined,
//         endTime: undefined,
//         type: undefined,
//         amount: null,
//         foodType: null,
//         unit: null,
//         note: null,
//         medicineType: null
//       }
//     }
//   },
//   model: 'file',
//   route: 'create'
// });

// /files/delete
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
        fileId: ':id'
      }
    }
  },
  model: 'file',
  id: '1',
  route: 'delete'
});
