import { fetchRecommendedPlan } from './db';

export const generatePlanNotifications = async (user: any) => {
  const { numOfNaps, wakeWindow } =
    (await fetchRecommendedPlan()) as unknown as {
      numOfNaps: number;
      wakeWindow: number;
    };
  const wakeWindowInMS = wakeWindow * 60 * 60 * 1000; // 1 hour in milliseconds

  // Get today's events
  const today = new Date().setHours(0, 0, 0, 0);
  const naps = user.events
    .filter((event: any) => {
      return (
        new Date(event.date).setHours(0, 0, 0, 0) === today &&
        event.type === 'nap'
      );
    })
    .sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Generate notifications based on planObject and today's events
  let notification;
  if (naps.length < numOfNaps) {
    const nextNapTime = new Date(naps[0]);
    nextNapTime.setTime(nextNapTime.getTime() + wakeWindowInMS);
    notification = {
      title: 'Nap',
      time: nextNapTime,
      content: 'Your next nap is recommended to be at this time'
    };
  } else if (naps.length === numOfNaps) {
    const suggestedBedtime = new Date(naps[0]);
    suggestedBedtime.setTime(suggestedBedtime.getTime() + wakeWindowInMS);
    notification = {
      title: 'Bedtime',
      time: suggestedBedtime,
      content: 'Your suggested bedtime is at this time'
    };
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
