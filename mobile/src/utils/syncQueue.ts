import { getEvent, getSleepWindowsForEvent } from './localDb';
import { createSleepEventFromLocal, createEventFromLocal } from './bridge';

interface SyncTask {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export const syncQueue: SyncTask[] = [];

export const addToSyncQueue = (task: SyncTask) => {
  syncQueue.push(task);
};

export const syncData = async () => {
  for (let i = 0; i < syncQueue.length; i++) {
    const task = syncQueue[i];
    task.status = 'syncing';
    try {
      const localData = await getEvent(task.id);
      if (
        localData &&
        (task.operation === 'insert' || task.operation === 'update')
      ) {
        if (localData.type === 'nap' || localData.type === 'night_sleep') {
          const sleepWindows = await getSleepWindowsForEvent(localData.eventId);
          if (!sleepWindows) {
            throw new Error(
              `No sleep windows found for event with id ${localData.eventId}`
            );
          }
          await createSleepEventFromLocal(localData, sleepWindows);
        } else {
          await createEventFromLocal(localData);
        }
      }
      task.status = 'completed';
      syncQueue.splice(i, 1);
      i--;
    } catch (error) {
      task.status = 'failed';
    }
  }
};
