import { getEvent } from './localDb';
import { createEvent } from './db';

interface SyncTask {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

const syncQueue: SyncTask[] = [];

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
        await createEvent(localData);
      }
      task.status = 'completed';
      syncQueue.splice(i, 1);
      i--;
    } catch (error) {
      task.status = 'failed';
    }
  }
};
