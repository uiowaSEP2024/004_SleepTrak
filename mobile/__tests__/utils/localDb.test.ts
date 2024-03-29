import {
  initializeDatabase,
  saveEvent,
  saveSleepWindow,
  getEvent,
  getSleepWindow
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
    it('should insert event into Event table', () => {
      saveEvent(event);
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

    it('should handle errors when saving event', () => {
      const mockError = new Error('Failed to execute SQL query');
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback, errorCallback) => {
          errorCallback(mockError);
        }
      );
      expect(() => {
        saveEvent(event);
      }).toThrowError('Failed to save event');
    });
  });

  describe('saveSleepWindow', () => {
    it('should insert sleep window into the SleepWindow table', () => {
      saveSleepWindow(sleepWindow);
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

    it('should handle errors when saving sleep window', () => {
      const mockError = new Error('Failed to execute SQL query');
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback, errorCallback) => {
          errorCallback(mockError);
        }
      );
      expect(() => {
        saveSleepWindow(sleepWindow);
      }).toThrowError('Failed to save sleep window');
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

  describe('getSleepWindow', () => {
    it('should retrieve a sleep window from the SleepWindow table', async () => {
      mockTx.executeSql.mockImplementationOnce(
        (query, args, successCallback) => {
          const unused = null;
          successCallback(unused, { rows: { _array: [sleepWindow] } });
        }
      );
      const fetchedSleepWindow = await getSleepWindow(sleepWindow.windowId);
      expect(fetchedSleepWindow).toEqual(sleepWindow);
    });

    it('should handle errors when retrieving a sleep event', async () => {
      const windowId = 'nonExistentWindowId';
      const mockError = new Error('Failed to retrieve window');
      mockTx.executeSql.mockImplementationOnce(
        (query, params, successCallback, errorCallback) => {
          errorCallback(undefined, mockError);
        }
      );
      try {
        await getSleepWindow(windowId);
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toMatch('Failed to retrieve window');
        expect(error).toBe(mockError);
      }
    });
  });
});
