import { jest, afterEach } from '@jest/globals';
import { prisma } from '../prisma/client.js';

const prismaSpy = {
  users: {
    all: jest.spyOn(prisma.user, 'findMany'),
    get: jest.spyOn(prisma.user, 'findUnique'),
    search: jest.spyOn(prisma.user, 'findMany'),
    create: jest.spyOn(prisma.user, 'create'),
    update: jest.spyOn(prisma.user, 'update'),
    delete: jest.spyOn(prisma.user, 'delete')
  },
  events: {
    all: jest.spyOn(prisma.event, 'findMany'),
    get: jest.spyOn(prisma.event, 'findUnique'),
    search: jest.spyOn(prisma.event, 'findMany'),
    create: jest.spyOn(prisma.event, 'create'),
    update: jest.spyOn(prisma.event, 'update'),
    delete: jest.spyOn(prisma.event, 'delete'),
    user: jest.spyOn(prisma.event, 'findMany')
  },
  plans: {
    all: jest.spyOn(prisma.plan, 'findMany'),
    get: jest.spyOn(prisma.plan, 'findUnique'),
    search: jest.spyOn(prisma.plan, 'findMany'),
    create: jest.spyOn(prisma.plan, 'create'),
    update: jest.spyOn(prisma.plan, 'update'),
    delete: jest.spyOn(prisma.plan, 'delete')
  },
  reminders: {
    all: jest.spyOn(prisma.reminder, 'findMany'),
    get: jest.spyOn(prisma.reminder, 'findUnique'),
    search: jest.spyOn(prisma.reminder, 'findMany'),
    create: jest.spyOn(prisma.reminder, 'create'),
    update: jest.spyOn(prisma.reminder, 'update'),
    delete: jest.spyOn(prisma.reminder, 'delete')
  },
  babies: {
    all: jest.spyOn(prisma.baby, 'findMany'),
    get: jest.spyOn(prisma.baby, 'findUnique'),
    search: jest.spyOn(prisma.baby, 'findMany'),
    create: jest.spyOn(prisma.baby, 'create'),
    update: jest.spyOn(prisma.baby, 'update'),
    delete: jest.spyOn(prisma.baby, 'delete')
  },
  medicines: {
    create: jest.spyOn(prisma.medicine, 'create')
  },
  questions: {
    all: jest.spyOn(prisma.onboardingQuestion, 'findMany'),
    get: jest.spyOn(prisma.onboardingQuestion, 'findUnique')
  },
  answers: {
    create: jest.spyOn(prisma.onboardingAnswer, 'create'),
    update: jest.spyOn(prisma.onboardingAnswer, 'update')
  },
  recommended_plans: {
    get: jest.spyOn(prisma.recommendedPlan, 'findUnique')
  },
  'sleep-windows': {
    get: jest.spyOn(prisma.sleepWindow, 'findUnique'),
    getByEventId: jest.spyOn(prisma.sleepWindow, 'findMany'),
    create: jest.spyOn(prisma.sleepWindow, 'create'),
    update: jest.spyOn(prisma.sleepWindow, 'update'),
    delete: jest.spyOn(prisma.sleepWindow, 'delete')
  },
  files: {
    get: jest.spyOn(prisma.file, 'findUnique'),
    search: jest.spyOn(prisma.file, 'findMany'),
    create: jest.spyOn(prisma.file, 'create'),
    delete: jest.spyOn(prisma.file, 'delete')
  }
};

afterEach(() => {
  for (const controller in prismaSpy) {
    for (const route in prismaSpy[controller]) {
      prismaSpy[controller][route].mockReset();
    }
  }
});

export default prismaSpy;
