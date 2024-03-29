import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.sqlite');

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
  db.transaction((tx) => {
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
  });
};

export const saveEvent = (event: Event) => {
  db.transaction((tx) => {
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
  });
};

export const saveSleepWindow = (sleepWindow: SleepWindow) => {
  db.transaction((tx) => {
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
  });
};

export const getEvent = (eventId: string): Promise<Event | undefined> => {
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
