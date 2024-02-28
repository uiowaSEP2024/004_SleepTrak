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
