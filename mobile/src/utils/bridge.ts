import type {
  LocalEvent,
  LocalSleepWindow,
  RemoteEvent,
  RemoteSleepWindow
} from './interfaces';
import { getUserCredentials, getAuth0User } from './auth';

/**
 * Converts a LocalSleepWindow to a RemoteSleepWindow
 * @param localSleepWindow
 * @returns remoteSleepWindow
 */
export async function localSleepWindowToRemote(
  localSleepWindow: LocalSleepWindow
): Promise<RemoteSleepWindow> {
  return {
    ...localSleepWindow,
    startTime: new Date(localSleepWindow.startTime),
    stopTime: new Date(localSleepWindow.stopTime),
    isSleep: Boolean(localSleepWindow.isSleep)
  };
}

/**
 * Converts a LocalEvent to a RemoteEvent
 * @param localEvent
 * @param ownerId
 * @returns remoteEvent
 */
export async function localEventToRemote(
  localEvent: LocalEvent,
  ownerId: string
): Promise<RemoteEvent> {
  const sleepWindows: RemoteSleepWindow[] = [];
  return {
    ...localEvent,
    ownerId,
    startTime: new Date(localEvent.startTime),
    endTime: localEvent.endTime ? new Date(localEvent.endTime) : undefined,
    cribStartTime: localEvent.cribStartTime
      ? new Date(localEvent.cribStartTime)
      : undefined,
    cribStopTime: localEvent.cribStopTime
      ? new Date(localEvent.cribStopTime)
      : undefined,
    sleepWindows
  };
}

/**
 * Creates a sleep event from a local event and sleep windows
 * @param eventData - The data of the event to be created.
 * @param windowsData - The data of the event to be created.
 * @returns The API response if successful, otherwise false.
 */
export const createSleepEventFromLocal = async (
  eventData: LocalEvent,
  windowsData: LocalSleepWindow[]
) => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      const remoteEventData = await localEventToRemote(
        eventData,
        (user as { sub: string }).sub
      );
      if (accessToken) {
        const eventResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/events/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ...remoteEventData,
              ownerId: (user as { sub: string }).sub
            })
          }
        );

        if (!eventResponse.ok) {
          const errorMessage = await eventResponse.text();
          throw new Error(`Failed to create event: ${errorMessage}`);
        }

        const event = await eventResponse.json();
        for (const windowData of windowsData) {
          const remoteWindowData = await localSleepWindowToRemote(windowData);
          const windowResponse = await fetch(
            process.env.EXPO_PUBLIC_API_URL + '/sleep-windows/create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                ...remoteWindowData,
                eventId: event.eventId
              })
            }
          );

          if (!windowResponse.ok) {
            const errorMessage = await windowResponse.text();
            throw new Error(`Failed to create window: ${errorMessage}`);
          }
        }
      }
    } else {
      throw new Error('User credentials are not available');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Creates an event from a local event
 * @param eventData - The data of the event to be created.
 * @returns The API response if successful, otherwise false.
 */
export const createEventFromLocal = async (eventData: LocalEvent) => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      const remoteEventData = await localEventToRemote(
        eventData,
        (user as { sub: string }).sub
      );
      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/events/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ...remoteEventData
            })
          }
        );
        if (!apiResponse.ok) {
          throw new Error(
            'Failed to create event: ' + (await apiResponse.text())
          );
        }
        return apiResponse;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
