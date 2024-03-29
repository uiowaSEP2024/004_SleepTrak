import * as SQLite from 'expo-sqlite';

let localDb: SQLite.SQLiteDatabase;

export const getDatabase = () => {
  if (!localDb) {
    localDb = SQLite.openDatabase('db.sqlite');
  }
  return localDb;
};

interface Event {
  eventId: string;
  ownerId?: string;
  startTime: string;
  endTime?: string;
  type: string;
  amount?: number;
  foodType?: string;
  note?: string;
  unit?: string;
  medicineType?: string;
  cribStartTime?: string;
  cribStopTime?: string;
}

interface SleepWindow {
  windowId: string;
  eventId: string;
  startTime: string;
  stopTime: string;
  isSleep: boolean;
  note?: string;
}

export const initializeDatabase = () => {
  const db = getDatabase();
  db.transaction((tx) => {
    try {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS Event (
          eventId TEXT PRIMARY KEY,
          ownerId TEXT,
          startTime TEXT,
          endTime TEXT,
          type TEXT,
          amount REAL,
          foodType TEXT,
          note TEXT,
          unit TEXT,
          medicineType TEXT,
          cribStartTime TEXT,
          cribStopTime TEXT
        )
      `);
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS SleepWindow (
          windowId TEXT PRIMARY KEY,
          eventId TEXT,
          startTime TEXT,
          stopTime TEXT,
          isSleep INTEGER,
          note TEXT,
          FOREIGN KEY(eventId) REFERENCES Event(eventId)
        )
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  });
};

export const saveEvent = (event: Event) => {
  const db = getDatabase();
  db.transaction((tx) => {
    try {
      tx.executeSql(
        'INSERT INTO Event (eventId, ownerId, startTime, endTime, type, amount, foodType, note, unit, medicineType, cribStartTime, cribStopTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          event.eventId,
          event.ownerId ?? null,
          event.startTime,
          event.endTime ?? null,
          event.type,
          event.amount ?? null,
          event.foodType ?? null,
          event.note ?? null,
          event.unit ?? null,
          event.medicineType ?? null,
          event.cribStartTime ?? null,
          event.cribStopTime ?? null
        ]
      );
    } catch (error) {
      console.error('Error saving event:', error);
      throw new Error('Failed to save event');
    }
  });
};

export const saveSleepWindow = (sleepWindow: SleepWindow) => {
  const db = getDatabase();
  db.transaction((tx) => {
    try {
      tx.executeSql(
        'INSERT INTO SleepWindow (windowId, eventId, startTime, stopTime, isSleep, note) VALUES (?, ?, ?, ?, ?, ?)',
        [
          sleepWindow.windowId,
          sleepWindow.eventId,
          sleepWindow.startTime,
          sleepWindow.stopTime,
          sleepWindow.isSleep ? 1 : 0,
          sleepWindow.note ?? null
        ]
      );
    } catch (error) {
      console.error('Error saving sleep window:', error);
      throw new Error('Failed to save sleep window');
    }
  });
};

export const getEvent = (eventId: string): Promise<Event | undefined> => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Event WHERE eventId = ?',
        [eventId],
        (_, { rows: { _array } }) => {
          resolve(_array[0] as Event | undefined);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const getSleepWindow = (
  windowId: string
): Promise<SleepWindow | undefined> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM SleepWindow WHERE windowId = ?',
        [windowId],
        (_, { rows: { _array } }) => {
          resolve(_array[0] as SleepWindow | undefined);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
