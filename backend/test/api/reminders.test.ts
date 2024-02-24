import request from 'supertest';
import app from '../../src/app';
import { prismaMock } from '../mock_client';

const mockReminders = [
  {
    reminderId: 1,
    description: 'nap'
  },
  {
    reminderId: 2,
    description: 'nap'
  },
  {
    reminderId: 3,
    description: 'nap'
  }
];
const reminder = {
  reminderId: 4,
  description: 'bedtime'
};

describe('Test /reminders/all route', () => {
  test('GET /reminders returns all reminders', async () => {
    prismaMock.reminder.findMany.mockReturnValue(mockReminders);
    const response = await request(app).get('/reminders/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockReminders);
    expect(prismaMock.reminder.findMany).toHaveBeenCalledWith();
  });
});

describe('test /reminders/:id route', () => {
  test('GET /reminders/:id calls findUnique and returns reminder', async () => {
    const tid = 3;
    prismaMock.reminder.findUnique.mockReturnValue(
      mockReminders.filter((reminders) => reminders.reminderId === tid)
    );
    const response = await request(app).get('/reminders/{tid}');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockReminders.filter((reminders) => reminders.reminderId === tid)
    );
    response.body.forEach((reminder: any) => {
      expect(reminder.reminderId).toEqual(tid);
    });
    expect(prismaMock.reminder.findUnique).toHaveBeenCalledWith({
      where: { reminderId: '{tid}' }
    });
  });
});

describe('test /reminders/search route', () => {
  test('GET /reminders/search calls findMany and returns reminders', async () => {
    const description = 'nap';
    prismaMock.reminder.findMany.mockReturnValue(
      mockReminders.filter((reminder) => reminder.description === description)
    );
    const response = await request(app).get('/reminders/search');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockReminders.filter((reminder) => reminder.description === description)
    );
    response.body.forEach((reminder: any) => {
      expect(reminder.description).toEqual(description);
    });
    expect(prismaMock.reminder.findMany).toHaveBeenCalledWith({ where: {} });
  });
});

describe('test /reminders/create route', () => {
  test('POST /reminders/create calls create and returns reminder', async () => {
    prismaMock.reminder.create.mockReturnValue(reminder);
    const response = await request(app).post('/reminders/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(reminder);
  });
});

describe('test /reminders/:id/update route', () => {
  test('PUT /reminders/:id/update calls update and returns reminder', async () => {
    prismaMock.reminder.update.mockReturnValue(reminder);
    const response = await request(app)
      .put('/reminders/4/update')
      .send({ description: 'bedtime' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(reminder);
    expect(prismaMock.reminder.update).toHaveBeenCalledWith({
      data: {
        description: 'bedtime'
      },
      where: { reminderId: '4' }
    });
  });
});

describe('test /reminders/:id/delete route', () => {
  test('PUT /reminders/:id/delete calls delete and returns delete info', async () => {
    prismaMock.reminder.delete.mockReturnValue(reminder);
    const response = await request(app).delete('/reminders/4/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(reminder);
    expect(prismaMock.reminder.delete).toHaveBeenCalledWith({
      where: { reminderId: '4' }
    });
  });
});
