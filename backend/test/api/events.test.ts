import request from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../mock_client';

const mockEvents = [
  {
    eventId: 1,
    type: 'sleep'
  },
  {
    eventId: 2,
    type: 'wake'
  },
  {
    eventId: 3,
    type: 'food'
  },
  {
    eventId: 4,
    type: 'medicine'
  }
];
const event = {
  eventId: 5,
  type: 'nap'
};

describe('Test /events/all route', () => {
  test('GET /events returns all events', async () => {
    prismaMock.event.findMany.mockReturnValue(mockEvents);
    const response = await request(app).get('/events/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockEvents);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith();
  });
});

describe('test /events/:id route', () => {
  test('GET /events/:id calls findUnique and returns event', async () => {
    const tid = 3;
    prismaMock.event.findUnique.mockReturnValue(
      mockEvents.filter((events) => events.eventId === tid)
    );
    const response = await request(app).get('/events/{tid}');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockEvents.filter((events) => {
        return events.eventId === tid;
      })
    );
    response.body.forEach((event: any) => {
      expect(event.eventId).toEqual(tid);
    });
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: { eventId: '{tid}' }
    });
  });
});

describe('test /events/search route', () => {
  test('GET /events/search calls findMany and returns events', async () => {
    const type = 'sleep';
    prismaMock.event.findMany.mockReturnValue(
      mockEvents.filter((event) => event.type === type)
    );
    const response = await request(app).get('/events/search');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockEvents.filter((event) => event.type === type)
    );
    response.body.forEach((event: any) => {
      expect(event.type).toEqual(type);
    });
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({ where: {} });
  });
});

describe('test /events/create route', () => {
  test('POST /events/create calls create and returns event', async () => {
    prismaMock.event.create.mockReturnValue(event);
    const response = await request(app).post('/events/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(event);
  });
});

describe('test /events/:id/update route', () => {
  test('PUT /events/:id/update calls update and returns event', async () => {
    prismaMock.event.update.mockReturnValue(event);
    const response = await request(app)
      .put('/events/4/update')
      .send({ type: 'nap' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(event);
    expect(prismaMock.event.update).toHaveBeenCalledWith({
      data: {
        type: 'nap'
      },
      where: { eventId: '4' }
    });
  });
});

describe('test /events/:id/delete route', () => {
  test('PUT /events/:id/delete calls delete and returns delete info', async () => {
    prismaMock.event.delete.mockReturnValue(event);
    const response = await request(app).delete('/events/4/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(event);
    expect(prismaMock.event.delete).toHaveBeenCalledWith({
      where: { eventId: '4' }
    });
  });
});
