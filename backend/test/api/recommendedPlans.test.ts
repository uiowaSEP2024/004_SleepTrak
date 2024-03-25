import { getAgeInMonth } from '../../src/utils/plansUtil.js';
import { testRoute } from './common.js';
import prismaSpy from '../prismaSpy.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const recommendedPlanMock = [
  {
    ageInMonth: '0M',
    numOfNaps: 5,
    wakeWindow: 1.25
  },
  {
    ageInMonth: '1M',
    numOfNaps: 5,
    wakeWindow: 1
  },
  {
    ageInMonth: '2M',
    numOfNaps: 4,
    wakeWindow: 1.5
  },
  {
    ageInMonth: '3M',
    numOfNaps: 4,
    wakeWindow: 1.5
  },
  {
    ageInMonth: '4M',
    numOfNaps: 4,
    wakeWindow: 1.5
  }
];

const babyMockHappyPath = {
  babyId: '3',
  parentId: '3',
  name: 'Adnane',
  dob: new Date(),
  weight: 8,
  medicine: 'pencillin'
};

const babyMockSadPath = {
  babyId: '4',
  parentId: '4',
  name: 'Sergio',
  dob: new Date(2000, 8, 29),
  weight: 80,
  medicine: 'pencillin'
};

// Happy Path Tests
// ============================================================================

// recommended_plans/:id
testRoute({
  description: 'returns recommended plan matching baby age',
  reqData: {},
  mockData: recommendedPlanMock.filter(
    (recommendedPlan) =>
      recommendedPlan.ageInMonth ===
      getAgeInMonth(babyMockHappyPath.dob.toString())
  ),
  expectData: {
    status: 200,
    body: recommendedPlanMock.filter(
      (recommendedPlan) =>
        recommendedPlan.ageInMonth ===
        getAgeInMonth(babyMockHappyPath.dob.toString())
    ),
    calledWith: {
      where: {
        ageInMonth: getAgeInMonth(babyMockHappyPath.dob.toString())
      }
    }
  },
  model: 'recommended_plan',
  id: babyMockHappyPath.babyId,
  before: () => {
    prismaSpy.babies.get.mockResolvedValue(babyMockHappyPath);
  }
});

// Sad Path Tests
// ============================================================================

// recommended_plans/:id
testRoute({
  description: 'returns nothing if no plan matches the baby age',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        ageInMonth: getAgeInMonth(babyMockSadPath.dob.toString())
      }
    }
  },
  model: 'recommended_plan',
  id: babyMockSadPath.babyId,
  before: () => {
    prismaSpy.babies.get.mockResolvedValue(babyMockSadPath);
  }
});

testRoute({
  description: 'returns nothing if baby with given baby id does not exist',
  reqData: {},
  mockData: {},
  expectData: {
    status: 200,
    body: {},
    calledWith: {
      where: {
        ageInMonth: getAgeInMonth(babyMockSadPath.dob.toString())
      }
    }
  },
  model: 'recommended_plan',
  id: '-1',
  before: () => {
    prismaSpy.babies.get.mockResolvedValue(babyMockSadPath);
  }
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

// recommended_plans/:id
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
        ageInMonth: getAgeInMonth(babyMockHappyPath.dob.toString())
      }
    }
  },
  model: 'recommended_plan',
  id: '1',
  before: () => {
    prismaSpy.babies.get.mockResolvedValue(babyMockHappyPath);
  }
});
