import { fetchPlan } from './db';

// Commenting this out for now because the way reminders are set up rn doesn't work
//   with dynamic generation of notifications

// export const generatePlanNotifications = async (user: any) => {
//   user = user.user;
//   const planObject = await fetchPlan();
//   if (!planObject) {
//     return [];
//   }

//   const { numOfNaps, wakeWindow } =
//     (await fetchPlan()) as unknown as {
//       numOfNaps: number;
//       wakeWindow: number;
//     };
//   const wakeWindowInMS = wakeWindow * 60 * 60 * 1000;

//   // Return if user has no events
//   let naps = [];
//   if (user.events && user.events.length > 0) {
//     // Get today's events
//     const today = new Date().setHours(0, 0, 0, 0);
//     naps = user.events
//       .filter((event: any) => {
//         return (
//           new Date(event.endTime).setHours(0, 0, 0, 0) === today &&
//           event.type === 'nap'
//         );
//       })
//       .sort((a: any, b: any) => {
//         return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
//       });
//   }

//   // Generate notifications based on planObject and today's events
//   function createNotification(
//     title: string,
//     endTime: Date,
//     wakeWindowInMS: number
//   ) {
//     const time = new Date(endTime);
//     time.setTime(time.getTime() + wakeWindowInMS);
//     return {
//       title,
//       time
//     };
//   }

//   let notification;
//   if (naps.length === 0 && user.events.length > 0) {
//     const sleeps = user.events.filter(
//       (event: any) => event.type === 'night_sleep'
//     );
//     if (sleeps.length === 0) {
//       return [];
//     }

//     sleeps.sort(
//       (a: any, b: any) =>
//         new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
//     );
//     notification = createNotification(
//       'Nap',
//       new Date(sleeps[0].endTime),
//       wakeWindowInMS
//     );
//   } else if (naps.length < numOfNaps) {
//     notification = createNotification(
//       'Nap',
//       new Date(naps[0].endTime),
//       wakeWindowInMS
//     );
//   } else if (naps.length === numOfNaps) {
//     notification = createNotification(
//       'Bedtime',
//       new Date(naps[0].endTime),
//       wakeWindowInMS
//     );
//   }

//   return notification ? [notification] : [];
// };

function getTimeFromDate(date) {
  const hoursInSec = date.getHours() * 60 * 60;
  const minutesInSec = date.getMinutes() * 60;
  const seconds = date.getSeconds();

  return hoursInSec + minutesInSec + seconds;
}

export const generatePlanNotifications = async (user: any) => {
  user = user.user;
  const currentTimeInSec = getTimeFromDate(new Date());
  const planObject = await fetchPlan();
  if (!planObject) {
    return [];
  }

  let reminders = planObject.reminders;
  if (!reminders) {
    return [];
  }

  // Filter out reminders that are before the current time in terms of hour of the day
  reminders = reminders.filter((reminder: any) => {
    const reminderTime = getTimeFromDate(new Date(reminder.startTime));
    return reminderTime > currentTimeInSec;
  });

  // Sort the reminders by time of day in ascending order
  reminders.sort((a: any, b: any) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (reminders.length > 0) {
    const currentReminder = reminders[0];
    const reminderTime = new Date();
    reminderTime.setHours(0, 0, 0, 0);
    reminderTime.setSeconds(
      reminderTime.getSeconds() +
        getTimeFromDate(new Date(currentReminder.startTime))
    );

    return [
      {
        title: currentReminder.description,
        time: reminderTime
      }
    ];
  }
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
  return [...(planNotifications ?? []), ...(chatNotifications ?? [])];
};
