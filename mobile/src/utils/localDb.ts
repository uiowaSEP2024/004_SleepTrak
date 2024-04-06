import * as SQLite from 'expo-sqlite';
import type { LocalEvent, LocalSleepWindow } from './interfaces';

let localDb: SQLite.SQLiteDatabase;

export const getDatabase = () => {
  if (!localDb) {
    localDb = SQLite.openDatabase('db.sqlite');
  }
  return localDb;
};

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

export const saveEvent = (event: LocalEvent): Promise<void> => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
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
        resolve();
      } catch (error) {
        console.error('Error saving event:', error);
        reject(new Error('Failed to save event'));
      }
    });
  });
};

export const saveSleepWindow = (
  sleepWindow: LocalSleepWindow
): Promise<void> => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
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
        resolve();
      } catch (error) {
        reject(new Error('Failed to save sleep window'));
      }
    });
  });
};

export const getEvent = (eventId: string): Promise<LocalEvent | undefined> => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Event WHERE eventId = ?',
        [eventId],
        (_, { rows: { _array } }) => {
          resolve(_array[0] as LocalEvent | undefined);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const getSleepWindowsForEvent = (
  eventId: string
): Promise<LocalSleepWindow[] | undefined> => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          'SELECT * FROM SleepWindow WHERE eventId = ?',
          [eventId],
          (_, { rows: { _array } }) => {
            resolve(_array as LocalSleepWindow[] | undefined);
          },
          (_, error) => {
            reject(error);
            return true;
          }
        );
      } catch (error) {
        console.error('Error fetching sleep window:', error);
        reject(new Error('Failed to fetch sleep window'));
      }
    });
  });
};
