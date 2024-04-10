import {
  initializeDatabase,
  saveEvent,
  saveSleepWindow,
  getEvent,
  getSleepWindowsForEvent,
  deleteEvent
} from '../../src/utils/localDb';

jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn((callback) => callback(mockTx))
  }))
}));

const mockTx = {
  executeSql: jest.fn()
};

const event = {
  eventId: '1',
  startTime: '2024-01-01T12:00:00.000Z',
  endTime: '2024-01-01T13:00:00.000Z',
  type: 'night sleep'
};

const sleepWindow = {
  windowId: '4',
  eventId: '1',
  startTime: '2022-01-01T14:00:00.000Z',
  stopTime: '2022-01-01T15:00:00.000Z',
  isSleep: true,
  note: 'baby cried so much'
};

const sleepWindows = [
  {
    windowId: '5',
    eventId: '10',
    startTime: '2022-01-01T14:00:00.000Z',
    stopTime: '2022-01-01T15:00:00.000Z',
    isSleep: true,
    note: 'baby cried so much'
  },
  {
    windowId: '6',
    eventId: '10',
    startTime: '2022-01-01T16:00:00.000Z',
    stopTime: '2022-01-01T17:00:00.000Z',
    isSleep: true,
    note: 'baby slept well'
  },
  {
    windowId: '7',
    eventId: '11',
    startTime: '2022-01-01T18:00:00.000Z',
    stopTime: '2022-01-01T19:00:00.000Z',
    isSleep: true,
    note: 'baby woke up crying'
  }
];

describe('localDb methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeDatabase', () => {
    it('should create Event and SleepWindow tables', () => {
      initializeDatabase();
      expect(mockTx.executeSql).toHaveBeenCalledTimes(2);
      expect(mockTx.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS Event')
      );
      expect(mockTx.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS SleepWindow')
      );
    });

    it('should handle errors during database initialization', () => {
      const mockError = new Error('Failed to execute SQL query');
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback, errorCallback) => {
          errorCallback(mockError);
        }
      );
      expect(() => {
        initializeDatabase();
      }).toThrowError('Failed to initialize database');
    });
  });

  describe('saveEvent', () => {
    it('should insert event into Event table', async () => {
      await saveEvent(event);
      expect(mockTx.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTx.executeSql).toHaveBeenCalledWith(
        'INSERT INTO Event (eventId, ownerId, startTime, endTime, type, amount, foodType, note, unit, medicineType, cribStartTime, cribStopTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          event.eventId,
          null,
          event.startTime,
          event.endTime,
          event.type,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      );
    });

    it('should handle errors when saving event', async () => {
      const mockError = new Error('Failed to execute SQL query');
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback, errorCallback) => {
          errorCallback(mockError);
        }
      );
      await expect(saveEvent(event)).rejects.toThrow('Failed to save event');
    });
  });

  describe('saveSleepWindow', () => {
    it('should insert sleep window into the SleepWindow table', async () => {
      await saveSleepWindow(sleepWindow);
      expect(mockTx.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTx.executeSql).toHaveBeenCalledWith(
        'INSERT INTO SleepWindow (windowId, eventId, startTime, stopTime, isSleep, note) VALUES (?, ?, ?, ?, ?, ?)',
        [
          sleepWindow.windowId,
          sleepWindow.eventId,
          sleepWindow.startTime,
          sleepWindow.stopTime,
          1,
          sleepWindow.note
        ]
      );
    });

    it('should handle errors when saving sleep window', async () => {
      const mockError = new Error('Failed to execute SQL query');
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback, errorCallback) => {
          errorCallback(mockError);
        }
      );
      await expect(saveSleepWindow(sleepWindow)).rejects.toThrow(
        'Failed to save sleep window'
      );
    });
  });

  describe('getEvent', () => {
    it('should retrieve an event from the Event table', async () => {
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback) => {
          const unused = null;
          successCallback(unused, { rows: { _array: [event] } });
        }
      );
      const fetchedEvent = await getEvent(event.eventId);
      expect(fetchedEvent).toEqual(event);
    });

    it('should handle errors when retrieving an event', async () => {
      const eventId = 'nonExistentEventId';
      const mockError = new Error('Failed to retrieve event');
      mockTx.executeSql.mockImplementationOnce(
        (query, params, successCallback, errorCallback) => {
          errorCallback(undefined, mockError);
        }
      );
      try {
        await getEvent(eventId);
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toMatch('Failed to retrieve event');
        expect(error).toBe(mockError);
      }
    });
  });

  describe('getSleepWindowsForEvent', () => {
    it('should retrieve sleep windows for a given event id', async () => {
      mockTx.executeSql.mockImplementationOnce(
        (query, [eventId], successCallback) => {
          const unused = null;
          const filteredSleepWindows = sleepWindows.filter(
            (window) => window.eventId === eventId
          );
          successCallback(unused, { rows: { _array: filteredSleepWindows } });
        }
      );
      const fetchedSleepWindow = await getSleepWindowsForEvent('10');
      expect(fetchedSleepWindow).toHaveLength(2);
    });

    it('should handle errors when retrieving a sleep event', async () => {
      const eventId = 'nonExistentWindowId';
      const mockError = new Error('Failed to retrieve window');
      mockTx.executeSql.mockImplementationOnce(
        (query, params, successCallback, errorCallback) => {
          errorCallback(undefined, mockError);
        }
      );
      await expect(getSleepWindowsForEvent(eventId)).rejects.toEqual(mockError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event from the Event table', async () => {
      const eventId = '1';
      await deleteEvent(eventId);
      expect(mockTx.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTx.executeSql).toHaveBeenCalledWith(
        'DELETE FROM Event WHERE eventId = ?',
        [eventId]
      );
    });

    it('should handle errors when deleting an event', async () => {
      const eventId = 'nonExistentEventId';
      const mockError = new Error('Failed to delete event');
      mockTx.executeSql.mockImplementationOnce(
        (query, params, successCallback, errorCallback) => {
          errorCallback(undefined, mockError);
        }
      );
      await expect(deleteEvent(eventId)).rejects.toEqual(mockError);
    });
  });
});
