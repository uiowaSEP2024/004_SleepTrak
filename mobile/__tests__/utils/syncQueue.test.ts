import { addToSyncQueue, syncQueue, syncData } from '../../src/utils/syncQueue';
import { getEvent, getSleepWindowsForEvent } from '../../src/utils/localDb';

jest.mock('../../src/utils/localDb', () => ({
  getEvent: jest.fn(),
  getSleepWindowsForEvent: jest.fn()
}));
jest.mock('../../src/utils/auth', () => ({
  getUserCredentials: jest.fn(),
  getAuth0User: jest.fn()
}));
jest.mock('../../src/utils/bridge', () => ({
  createEventFromLocal: jest.fn(),
  createSleepEventFromLocal: jest.fn()
}));

const mockedGetEvent = getEvent as jest.Mock;
const mockedGetSleepWindowsForEvent = getSleepWindowsForEvent as jest.Mock;

const mockLocalEvent = {
  eventId: '1',
  ownerId: '2',
  startTime: '2024-01-01T12:00:00.000Z',
  type: 'food'
};
const mockSleepLocalEvent = {
  eventId: '1',
  ownerId: '2',
  startTime: '2024-01-01T12:00:00.000Z',
  type: 'night_sleep'
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
interface SyncTask {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

const mockTask: SyncTask = {
  id: '1',
  operation: 'insert',
  data: { ...mockLocalEvent },
  status: 'pending'
};

const mockSleepTask: SyncTask = {
  id: '1',
  operation: 'insert',
  data: { ...mockSleepLocalEvent },
  status: 'pending'
};

describe('Sync Queue', () => {
  beforeEach(() => {
    while (syncQueue.length > 0) {
      syncQueue.pop();
    }
  });

  describe('addToSyncQueue', () => {
    it('should add a task to the sync queue', () => {
      addToSyncQueue(mockTask);
      expect(syncQueue).toContain(mockTask);
    });
  });

  describe('syncData', () => {
    it('should sync non sleep event correctly', async () => {
      addToSyncQueue(mockTask);
      mockedGetEvent.mockResolvedValue(mockLocalEvent);
      mockedGetSleepWindowsForEvent.mockResolvedValue([]);
      await syncData();
      expect(syncQueue).not.toContain(mockTask);
    });

    it('should sync sleep event correctly', async () => {
      addToSyncQueue(mockSleepTask);
      mockedGetEvent.mockResolvedValue(mockSleepLocalEvent);
      mockedGetSleepWindowsForEvent.mockResolvedValue(mockLocalSleepWindows);
      await syncData();
      expect(syncQueue).not.toContain(mockSleepTask);
    });

    it('should throw error when no sleep windows found', async () => {
      addToSyncQueue(mockSleepTask);
      mockedGetEvent.mockResolvedValue(mockSleepLocalEvent);
      mockedGetSleepWindowsForEvent.mockResolvedValue(null);
      try {
        await syncData();
      } catch (error) {
        expect(error).toEqual(
          new Error('No sleep windows found for event with id 1')
        );
      }
    });
  });
});
