import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.sqlite');

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
