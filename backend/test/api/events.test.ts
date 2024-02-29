import { testRoute } from './common.js';

const mockEvents = [
  {
    eventId: '1',
    ownerId: '1',
    startTime: '2022-01-01T12:00:00Z',
    endTime: '2022-01-01T13:00:00Z',
    type: 'nap'
  },
  {
    eventId: '2',
    ownerId: '2',
    startTime: '2023-01-01T12:00:00Z',
    endTime: '2023-01-01T13:00:00Z',
    type: 'sleep'
  }
];
const event = {
  eventId: '3',
  ownerId: '3',
  startTime: '2024-01-01T12:00:00Z',
  endTime: '2024-01-01T13:00:00Z',
  type: 'wake'
};

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
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
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
