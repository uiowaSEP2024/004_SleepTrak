import { fetchRecommendedPlan } from './db';

export const generatePlanNotifications = async (user: any) => {
  user = user.user;
  const { numOfNaps, wakeWindow } =
    (await fetchRecommendedPlan()) as unknown as {
      numOfNaps: number;
      wakeWindow: number;
    };
  const wakeWindowInMS = wakeWindow * 60 * 60 * 1000;

  // Return if user has no events
  let naps = [];
  if (user.events && user.events.length > 0) {
    // Get today's events
    const today = new Date().setHours(0, 0, 0, 0);
    naps = user.events
      .filter((event: any) => {
        return (
          new Date(event.endTime).setHours(0, 0, 0, 0) === today &&
          event.type === 'nap'
        );
      })
      .sort((a: any, b: any) => {
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
      });
  }

  // Generate notifications based on planObject and today's events
  function createNotification(
    title: string,
    endTime: Date,
    wakeWindowInMS: number
  ) {
    const time = new Date(endTime);
    time.setTime(time.getTime() + wakeWindowInMS);
    return {
      title,
      time
    };
  }

  let notification;
  if (naps.length === 0 && user.events.length > 0) {
    const sleeps = user.events.filter(
      (event: any) => event.type === 'night_sleep'
    );
    if (sleeps.length === 0) {
      return [];
    }

    sleeps.sort(
      (a: any, b: any) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    notification = createNotification(
      'Nap',
      new Date(sleeps[0].endTime),
      wakeWindowInMS
    );
  } else if (naps.length < numOfNaps) {
    notification = createNotification(
      'Nap',
      new Date(naps[0].endTime),
      wakeWindowInMS
    );
  } else if (naps.length === numOfNaps) {
    notification = createNotification(
      'Bedtime',
      new Date(naps[0].endTime),
      wakeWindowInMS
    );
  }

  return notification ? [notification] : [];
};

export const generateChatNotifications = async (user: any) => {
  return [];
};

export const generateNotifications = async (user: any) => {
  // Generate notifications based on planObject
  const planNotifications = await generatePlanNotifications(user);

  // Generate notifications based on chat messages
  const chatNotifications = await generateChatNotifications(user);

  // Return the notifications
  return [...planNotifications, ...chatNotifications];
};
