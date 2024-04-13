import { User } from '@auth0/auth0-react';
import { User as UserModel } from '@prisma/client';
import dayjs from 'dayjs';

export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function getAgeInMonthFromDob(dob: Date): string {
  const today = new Date();

  let ageYears = today.getFullYear() - dob.getFullYear();
  let ageMonths = today.getMonth() - dob.getMonth();

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return ageYears * 12 + ageMonths + 'M';
}

export function getAgeInMonth(dob: string): string {
  const today = new Date();
  const birthDate = new Date(dob);

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return ageYears * 12 + ageMonths + 'M';
}

export function formatDateTo12HourFormat(dateArg: Date | null) {
  if (dateArg === null) {
    return '';
  }
  const date = new Date(dateArg);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours < 12 ? 'AM' : 'PM';

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}

export function formatTimeTo12HourFormat(dateString: string | null) {
  if (dateString === null) {
    return '';
  }

  const date = new Date(dateString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours < 12 ? 'AM' : 'PM';

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}

export const createSleepPlan = (
  wakeUpTime: dayjs.Dayjs | null,
  earliestGetReadyTime: dayjs.Dayjs | null,
  desiredBedTime: dayjs.Dayjs | null,
  wakeWindows: number[],
  numOfNaps: number,
  userId: string | undefined,
  user: string | User | undefined
) => {
  // Create reminders
  const morningRise = [
    {
      description: 'Morning Rise',
      startTime: wakeUpTime?.toDate()
    }
  ];

  const naps: {
    description: string;
    startTime: Date | null;
    endTime: Date | null;
  }[] = [];

  // Compute how long each nap is
  const totalDayTime = desiredBedTime?.diff(wakeUpTime, 'hour') ?? 12;
  const totalWakeWindows = wakeWindows.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const napTime = (totalDayTime - totalWakeWindows) / numOfNaps;

  // Create naps based on wakeUpTime, wakeWindowss, and desiredBedTime
  let napEndTime = wakeUpTime;
  for (let index = 0; index < wakeWindows.length - 1; index++) {
    const napStartTime = napEndTime?.add(wakeWindows[index], 'hour') || null;
    napEndTime = napStartTime?.add(napTime, 'hour') || null;
    naps.push({
      description: `Nap ${index + 1}`,
      startTime: napStartTime?.toDate() || null,
      endTime: napEndTime?.toDate() || null
    });
  }

  const getReadyForBed = [
    {
      description: 'Get Ready for bed',
      startTime: earliestGetReadyTime?.toDate()
    }
  ];

  const asleep = [
    {
      description: 'Asleep ',
      startTime: desiredBedTime?.toDate()
    }
  ];

  const reminders = [...morningRise, ...naps, ...getReadyForBed, ...asleep];

  const planData = {
    clientId: userId,
    coachId: user?.sub,
    reminders: reminders
  };

  return planData;
};

export const getName = (user: UserModel | null): string => {
  if (!user) return '';
  return user.first_name + ' ' + user.last_name;
};

export const readableDate = (date: Date | null): string => {
  if (!date) return '';
  const currentDate = new Date();
  let readableDate = '';
  if (currentDate.getFullYear() !== date.getFullYear()) {
    readableDate += date.getFullYear() + ' ';
  }
  if (currentDate.getMonth() !== date.getMonth()) {
    readableDate += date.getMonth() + ' ';
  }
  if (currentDate.getDate() !== date.getDate()) {
    readableDate += date.getDate() + ' ';
  }
  if (date.getHours() > 12) {
    readableDate += date.getHours() - 12 + ':' + date.getMinutes() + ' pm';
  } else {
    readableDate += date.getHours() + ':' + date.getMinutes() + ' am';
  }

  return readableDate;
};
