import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { testRoute } from './common.js';
const mockAnswers = [
  {
    answerId: '1',
    answer_text: 'test answer',
    questionId: '1',
    userId: '1',
    babyId: '1'
  },
  {
    answerId: '2',
    answer_text: 'test answer',
    questionId: '2',
    userId: '1',
    babyId: '1'
  },
  {
    answerId: '3',
    answer_text: 'test answer 2',
    questionId: '2',
    userId: '2',
    babyId: '2'
  }
];

const answer = {
  answerId: '1',
  answer_text: 'test answer',
  questionId: '1',
  userId: '3',
  babyId: '3'
};

// Happy Path Tests
// ============================================================================

// /answers/create
const { userId, babyId, questionId, ...answerProps } = answer;
testRoute({
  description: 'returns created answer object',
  reqData: {
    ...answer
  },
  mockData: answer,
  expectData: {
    status: 200,
    body: answer,
    calledWith: {
      data: {
        ...answerProps,
        user: { connect: { userId: answer.userId } },
        question: { connect: { questionId: answer.questionId } },
        baby: { connect: { babyId: answer.babyId } }
      }
    }
  },
  model: 'answer',
  route: 'create'
});

// /answers/update
testRoute({
  description: 'returns updated event',
  reqData: {
    ...answer
  },
  mockData: answer,
  expectData: {
    status: 200,
    body: answer,
    calledWith: {
      data: {
        ...answer
      },
      where: {
        answerId: ':id'
      }
    }
  },
  model: 'answer',
  id: '1',
  route: 'update'
});

// /answers/search
testRoute({
  description: 'returns events matching search by type',
  reqData: {
    userId: '1'
  },
  mockData: mockAnswers.filter((answer) => answer.userId === '1'),
  expectData: {
    status: 200,
    body: mockAnswers.filter((answer) => answer.userId === '1'),
    calledWith: {
      where: {
        userId: '1'
      }
    }
  },
  model: 'answer',
  route: 'search'
});

// Sad Path Tests
// ============================================================================

// /answers/create
testRoute({
  description: 'returns empty object when no data passed',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      data: {
        user: { connect: { userId: undefined } },
        question: { connect: { questionId: undefined } },
        baby: { connect: { babyId: undefined } },
        answerId: undefined,
        answer_text: undefined
      }
    }
  },
  model: 'answer',
  route: 'create'
});

// /answers/update
testRoute({
  description: 'returns unupdated event if no data passed',
  reqData: {},
  mockData: answer,
  expectData: {
    status: 200,
    body: answer,
    calledWith: {
      data: {},
      where: {
        answerId: ':id'
      }
    }
  },
  model: 'answer',
  id: '1',
  route: 'update'
});

// /events/search
testRoute({
  description: 'returns nothing if no events match searched role',
  reqData: {
    userId: '100'
  },
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        userId: '100'
      }
    }
  },
  model: 'answer',
  route: 'search'
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

// /answers/create
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
        user: { connect: { userId: undefined } },
        question: { connect: { questionId: undefined } },
        baby: { connect: { babyId: undefined } },
        answerId: undefined,
        answer_text: undefined
      }
    }
  },
  model: 'answer',
  route: 'create'
});

// /answers/update
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
        answerId: ':id'
      }
    }
  },
  model: 'answer',
  id: '1',
  route: 'update'
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
  model: 'answer',
  route: 'search'
});
