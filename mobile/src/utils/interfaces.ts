/**
 * This file contains all the interfaces used in the application.
 */

export interface LocalEvent {
  eventId: string;
  ownerId?: string | null;
  startTime: string;
  endTime?: string | null;
  type: string;
  amount?: number | null;
  foodType?: string | null;
  note?: string | null;
  unit?: string | null;
  medicineType?: string | null;
  cribStartTime?: string | null;
  cribStopTime?: string | null;
}

export interface LocalSleepWindow {
  windowId: string;
  eventId: string;
  startTime: string;
  stopTime: string;
  isSleep: boolean;
  note: string;
}

export interface RemoteEvent {
  eventId: string;
  ownerId: string;
  startTime: Date;
  endTime?: Date | null;
  type: string;
  amount?: number | null;
  foodType?: string | null;
  note?: string | null;
  unit?: string | null;
  medicineType?: string | null;
  cribStartTime?: Date | null;
  cribStopTime?: Date | null;
  sleepWindows: RemoteSleepWindow[];
}

export interface RemoteSleepWindow {
  windowId: string;
  eventId: string;
  startTime: Date;
  stopTime: Date;
  isSleep: boolean;
  note: string;
}
