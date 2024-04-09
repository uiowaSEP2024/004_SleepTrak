import {
  localSleepWindowToRemote,
  localEventToRemote,
  createSleepEventFromLocal,
  createEventFromLocal
} from '../../src/utils/bridge';
import { getUserCredentials, getAuth0User } from '../../src/utils/auth';

jest.mock('../../src/utils/interfaces', () => ({
  LocalSleepWindow: jest.fn(),
  RemoteSleepWindow: jest.fn()
}));

jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));

const mockedGetUserCredentials = getUserCredentials as jest.Mock;
const mockedGetAuth0User = getAuth0User as jest.Mock;

global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ eventId: 'mockEventId' }), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    })
  )
);

const mockLocalEvent = {
  eventId: '1',
  ownerId: '2',
  startTime: '2024-01-01T12:00:00.000Z',
  endTime: '2024-01-01T13:00:00.000Z',
  type: 'night sleep'
};

const mockLocalSleepWindows = [
  {
    windowId: '5',
    eventId: '1',
    startTime: '2022-01-01T14:00:00.000Z',
    stopTime: '2022-01-01T15:00:00.000Z',
    isSleep: true,
    note: 'baby cried so much'
  },
  {
    windowId: '6',
    eventId: '1',
    startTime: '2022-01-01T16:00:00.000Z',
    stopTime: '2022-01-01T17:00:00.000Z',
    isSleep: true,
    note: 'baby slept well'
  },
  {
    windowId: '7',
    eventId: '1',
    startTime: '2022-01-01T18:00:00.000Z',
    stopTime: '2022-01-01T19:00:00.000Z',
    isSleep: true,
    note: 'baby woke up crying'
  }
];

describe('bridge methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('localSleepWindowToRemote function', () => {
    it('should convert a LocalSleepWindow to a RemoteSleepWindow', async () => {
      const localSleepWindow = {
        startTime: '2024-04-08T22:00:00.000Z',
        stopTime: '2024-04-09T06:00:00.000Z',
        isSleep: true,
        eventId: '456',
        note: 'baby slept well',
        windowId: '123'
      };
      const result = await localSleepWindowToRemote(localSleepWindow);
      expect(result.startTime).toEqual(expect.any(Date));
      expect(result.stopTime).toEqual(expect.any(Date));
      expect(result.isSleep).toBe(true);
    });
  });

  describe('localEventToRemote function', () => {
    it('should convert a LocalEvent to a RemoteEvent', async () => {
      const localEvent = {
        eventId: '1',
        ownerId: '123',
        startTime: '2024-04-08T22:00:00.000Z',
        endTime: '2024-04-09T06:00:00.000Z',
        type: 'night sleep',
        amount: 1,
        foodType: 'milk',
        note: 'baby slept well',
        unit: 'oz',
        medicineType: 'ibuprofen',
        cribStartTime: '2024-04-08T22:00:00.000Z',
        cribStopTime: '2024-04-09T06:00:00.000Z'
      };
      const ownerId = '123';
      const result = await localEventToRemote(localEvent, ownerId);
      expect(result.startTime).toEqual(expect.any(Date));
      expect(result.endTime).toEqual(expect.any(Date));
      expect(result.cribStartTime).toEqual(expect.any(Date));
      expect(result.cribStopTime).toEqual(expect.any(Date));
    });
  });

  describe('createSleepEventFromLocal', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should create a sleep event successfully', async () => {
      mockedGetUserCredentials.mockResolvedValue({ accessToken: 'testToken' });
      mockedGetAuth0User.mockResolvedValue({ sub: 'testSub' });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ eventId: 'testEventId' }),
        text: jest.fn().mockResolvedValue('')
      });
      await expect(
        createSleepEventFromLocal(mockLocalEvent, mockLocalSleepWindows)
      ).resolves.toBeFalsy();
    });

    it('should throw an error if user credentials are not available', async () => {
      mockedGetUserCredentials.mockResolvedValue(null);
      await expect(
        createSleepEventFromLocal(mockLocalEvent, mockLocalSleepWindows)
      ).rejects.toThrow();
    });

    it('should throw an error if sleep window creation fails', async () => {
      mockedGetUserCredentials.mockResolvedValue({ accessToken: 'testToken' });
      mockedGetAuth0User.mockResolvedValue({ sub: 'testSub' });
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ eventId: 'testEventId' }),
          text: jest.fn().mockResolvedValue('')
        })
        .mockResolvedValueOnce({
          ok: false,
          text: jest.fn().mockResolvedValue('Window creation failed')
        });

      await expect(
        createSleepEventFromLocal(mockLocalEvent, mockLocalSleepWindows)
      ).rejects.toThrow('Failed to create window: Window creation failed');
    });

    it('should throw an error if an error is thrown', async () => {
      mockedGetUserCredentials.mockRejectedValue(new Error('Test error'));
      await expect(
        createSleepEventFromLocal(mockLocalEvent, mockLocalSleepWindows)
      ).rejects.toThrow('Test error');
    });
  });

  describe('createEventFromLocal', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should create an event successfully', async () => {
      mockedGetUserCredentials.mockResolvedValue({ accessToken: 'testToken' });
      mockedGetAuth0User.mockResolvedValue({ sub: 'testSub' });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ eventId: 'testEventId' }),
        text: jest.fn().mockResolvedValue('')
      });

      const response = await createEventFromLocal(mockLocalEvent);
      if (response instanceof Response) {
        expect(response.ok).toBeTruthy();
      }
    });

    it('should return false if user credentials are not available', async () => {
      mockedGetUserCredentials.mockResolvedValue(null);
      const response = await createEventFromLocal(mockLocalEvent);
      expect(response).toBeFalsy();
    });

    it('should return false if access token is not available', async () => {
      mockedGetUserCredentials.mockResolvedValue({ accessToken: null });
      mockedGetAuth0User.mockResolvedValue({ sub: 'testSub' });
      const response = await createEventFromLocal(mockLocalEvent);
      expect(response).toBeFalsy();
    });

    it('should throw an error if event creation fails', async () => {
      mockedGetUserCredentials.mockResolvedValue({ accessToken: 'testToken' });
      mockedGetAuth0User.mockResolvedValue({ sub: 'testSub' });
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('Event creation failed')
      });
      await expect(createEventFromLocal(mockLocalEvent)).rejects.toThrow(
        'Failed to create event: Event creation failed'
      );
    });

    it('should throw an error if an error is thrown', async () => {
      mockedGetUserCredentials.mockRejectedValue(new Error('Test error'));
      await expect(createEventFromLocal(mockLocalEvent)).rejects.toThrow(
        'Test error'
      );
    });
  });
});
