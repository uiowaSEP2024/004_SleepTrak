import { PrismaClient } from '@prisma/client';
import type { User, Baby, Event } from '@prisma/client';
// import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const TOTAL_CLIENTS: number = 30;
const TOTAL_BABIES: number = 40;
const TOTAL_COACHES: number = 5;
const TOTAL_DAYS: number = 20;
const possibleNames: string[] = [
  'Valentina',
  'Camila',
  'Fiorella',
  'Sergio',
  'Dylan',
  'Mingi',
  'Haruko',
  'Hans',
  'Adnane',
  'Audrey',
  'Zach',
  'Joslin',
  'Curt'
];

// Questions
//  We can figure out a better way to populate these later.
const questionData = [
  {
    questionId: '1',
    description: 'What is your first name?',
    type: 'small-text',
    onboarding_screen: 1
  },
  {
    questionId: '2',
    description: 'What is your last name?',
    type: 'small-text',
    onboarding_screen: 2
  },
  {
    questionId: '3',
    description: "What is your Baby's name?",
    type: 'small-text',
    onboarding_screen: 3
  },
  {
    questionId: '4',
    description: 'When was your Baby born?',
    type: 'date',
    onboarding_screen: 4
  },
  {
    questionId: '5',
    description: 'Does your child have any medical conditions?',
    type: 'large-text',
    onboarding_screen: 5
  },
  {
    questionId: '6',
    description:
      "Briefly describe your child's sleep environment - Where do they sleep? Who do they sleep with? Do they have a routine? What is the environment like? ",
    type: 'large-text',
    onboarding_screen: 6
  },
  {
    questionId: '7',
    description:
      "Please tell me briefly what your child's day looks like in terms of sleep and feeds: Example: 7am wakes up, 9am eats, 10am nap...",
    type: 'large-text',
    onboarding_screen: 7
  },
  {
    questionId: '8',
    description: 'How does your child fall asleep at night?',
    type: 'large-text',
    onboarding_screen: 8
  },
  {
    questionId: '9',
    description: 'How many times does your child wake up per night?',
    type: 'number',
    onboarding_screen: 9
  },
  {
    questionId: '10',
    description:
      'Have you tried any methods to help your baby sleep better in the past? Tell me in detail about your experience.',
    type: 'large-text',
    onboarding_screen: 10
  },
  {
    questionId: '11',
    description: 'What sleep goals would you like to achieve?',
    type: 'large-text',
    onboarding_screen: 11
  },
  {
    questionId: '12',
    description:
      'Have you started implementing my Baby/Toddler Sleep Learning program?',
    type: 'yes-no',
    onboarding_screen: 12
  },
  {
    questionId: '13',
    description:
      "Please tell me in detail any additional information that can help me understand your child & family's sleep situation.",
    type: 'large-text',
    onboarding_screen: 13
  }
];

// Recommended Plans
//  We can figure out a better way to populate these later.
const recommendedPlansData = [
  {
    ageInMonth: '1M',
    numOfNaps: 5,
    wakeWindow: 1
  },
  {
    ageInMonth: '2M',
    numOfNaps: 5,
    wakeWindow: 1.25
  },
  {
    ageInMonth: '3M',
    numOfNaps: 5,
    wakeWindow: 1.75
  },
  {
    ageInMonth: '4M',
    numOfNaps: 4,
    wakeWindow: 2
  },
  {
    ageInMonth: '5M',
    numOfNaps: 4,
    wakeWindow: 2.25
  },
  {
    ageInMonth: '6M',
    numOfNaps: 3,
    wakeWindow: 2
  },
  {
    ageInMonth: '7M',
    numOfNaps: 3,
    wakeWindow: 2.5
  },
  {
    ageInMonth: '8M',
    numOfNaps: 3,
    wakeWindow: 3
  },
  {
    ageInMonth: '9M',
    numOfNaps: 2,
    wakeWindow: 3
  },
  {
    ageInMonth: '10M',
    numOfNaps: 2,
    wakeWindow: 3.25
  },
  {
    ageInMonth: '11M',
    numOfNaps: 2,
    wakeWindow: 3.5
  },
  {
    ageInMonth: '12M',
    numOfNaps: 2,
    wakeWindow: 3.75
  },
  {
    ageInMonth: '13M',
    numOfNaps: 2,
    wakeWindow: 4
  },
  {
    ageInMonth: '14M',
    numOfNaps: 2,
    wakeWindow: 4
  },
  {
    ageInMonth: '15M',
    numOfNaps: 2,
    wakeWindow: 4
  },
  {
    ageInMonth: '16M',
    numOfNaps: 2,
    wakeWindow: 4
  },
  {
    ageInMonth: '17M',
    numOfNaps: 2,
    wakeWindow: 4
  },
  {
    ageInMonth: '18M',
    numOfNaps: 1,
    wakeWindow: 5
  },
  {
    ageInMonth: '19M',
    numOfNaps: 1,
    wakeWindow: 5.25
  },
  {
    ageInMonth: '20M',
    numOfNaps: 1,
    wakeWindow: 5.5
  },
  {
    ageInMonth: '21M',
    numOfNaps: 1,
    wakeWindow: 5.5
  },
  {
    ageInMonth: '22M',
    numOfNaps: 1,
    wakeWindow: 5.5
  },
  {
    ageInMonth: '23M',
    numOfNaps: 1,
    wakeWindow: 5.5
  },
  {
    ageInMonth: '24M',
    numOfNaps: 1,
    wakeWindow: 5.75
  },
  {
    ageInMonth: '25M',
    numOfNaps: 1,
    wakeWindow: 5.75
  },
  {
    ageInMonth: '26M',
    numOfNaps: 1,
    wakeWindow: 6
  }
];

// Events
const MY_OWNER_ID = 'auth0|65f9e9bb0ad102735d5131b3'; // Haruko's test account

// Generates sleep windows
async function createWindows(
  eventId,
  startTime,
  stopTime,
  windowNum
): Promise<void> {
  // generate length of windows
  const totalDuration = (stopTime.getTime() - startTime.getTime()) / 60000;
  const minWindowLength = (totalDuration / windowNum) * 0.5;
  const maxWindowLength = (totalDuration / windowNum) * 1.5;
  const windowLengths: number[] = [];
  let remaining = totalDuration;
  for (let i = 0; i < windowNum - 1; i++) {
    const maxLength = Math.min(
      remaining - minWindowLength * (windowNum - i - 1),
      maxWindowLength
    );
    const length = getRandomNumber(minWindowLength, maxLength);
    windowLengths.push(length);
    remaining -= length;
  }
  windowLengths.push(remaining);
  // create windows
  let currentStartTime = new Date(startTime);
  for (let i = 0; i < windowNum; i++) {
    const currentEndTime = new Date(
      currentStartTime.getTime() + windowLengths[i] * 60000
    );
    await prisma.sleepWindow.create({
      data: {
        windowId: 'testID_' + generateUniqueID(),
        eventId,
        startTime: currentStartTime,
        stopTime: currentEndTime,
        isSleep: i % 2 === 0,
        note: 'note'
      }
    });
    currentStartTime = new Date(currentEndTime);
  }
}

async function createNightSleepEvent(
  eventId,
  startTime,
  endTime,
  cribStartTime = startTime,
  cribStopTime = endTime
): Promise<Event> {
  const event = await prisma.event.create({
    data: {
      eventId,
      ownerId: MY_OWNER_ID,
      startTime,
      endTime,
      type: 'night_sleep',
      cribStartTime,
      cribStopTime
    }
  });
  return event;
}

async function createNapEvent(
  eventId,
  startTime,
  endTime,
  cribStartTime = startTime,
  cribStopTime = endTime
): Promise<Event> {
  const event = await prisma.event.create({
    data: {
      eventId,
      ownerId: MY_OWNER_ID,
      startTime,
      endTime,
      type: 'nap',
      cribStartTime,
      cribStopTime
    }
  });
  return event;
}

async function createFeedEvent(startTime): Promise<Event> {
  return await prisma.event.create({
    data: {
      eventId: 'testID_' + generateUniqueID(),
      ownerId: MY_OWNER_ID,
      startTime,
      type: 'feed',
      amount: getRandomFloat(1, 10),
      foodType: getRandomElement([
        'breast milk',
        'formula',
        'tubeFeeding',
        'cowMilk',
        'soyMilk',
        'other'
      ]),
      note: 'note',
      unit: getRandomElement(['oz', 'ml'])
    }
  });
}

async function createMedicineEvent(startTime): Promise<Event> {
  return await prisma.event.create({
    data: {
      eventId: 'testID_' + generateUniqueID(),
      ownerId: MY_OWNER_ID,
      startTime,
      type: 'medicine',
      amount: getRandomFloat(1, 5),
      medicineType: getRandomElement(['Advil', 'NyQuil', 'DayQuil']),
      unit: getRandomElement(['oz', 'ml']),
      note: 'note'
    }
  });
}

function getRandomElement<T>(list: T[]): T {
  if (list.length === 0) {
    throw new Error('Error: The array is empty.');
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function getRandomNumber(minValue: number, maxValue: number): number {
  const difference = Math.abs(maxValue - minValue);
  return Math.floor(minValue + Math.random() * difference);
}

function generateUniqueID(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

function getRandomOddNumber(minValue: number, maxValue: number): number {
  let num;
  do {
    const difference = Math.abs(maxValue - minValue);
    num = Math.floor(minValue + Math.random() * difference);
  } while (num % 2 === 0);
  return num;
}

function getRandomFloat(minValue: number, maxValue: number): number {
  const difference = Math.abs(maxValue - minValue);
  return minValue + Math.random() * difference;
}

async function createOwnerData(): Promise<User> {
  return await prisma.user.create({
    data: {
      userId: 'testID_' + generateUniqueID(),
      email: 'owner@test.com',
      first_name: 'Owner',
      last_name: 'Test',
      role: 'owner'
    }
  });
}
async function createCoachData(): Promise<User> {
  return await prisma.user.create({
    data: {
      userId: 'testID_' + generateUniqueID(),
      email: 'coach' + getRandomNumber(0, 10000000) + '@test.com',
      first_name: getRandomElement(possibleNames),
      last_name: 'Test',
      role: 'coach'
    }
  });
}
async function createClientData(coachObjects: User[]): Promise<User> {
  return await prisma.user.create({
    data: {
      userId: 'testID_' + generateUniqueID(),
      email: 'client' + getRandomNumber(0, TOTAL_CLIENTS * 10000) + '@test.com',
      first_name: getRandomElement(possibleNames),
      last_name: 'Test',
      role: 'client',
      coach: { connect: { userId: getRandomElement(coachObjects).userId } }
    }
  });
}
async function createBabyData(clientObjects: User[]): Promise<Baby> {
  return await prisma.baby.create({
    data: {
      babyId: 'testID_' + generateUniqueID(),
      name: getRandomElement(possibleNames),
      dob: new Date(
        getRandomNumber(2022, 2024), // year
        getRandomNumber(1, 12), // month
        getRandomNumber(1, 30) // day
      ),
      weight: getRandomNumber(1, 10),
      medicine: getRandomElement(['Advil', 'NyQuil', 'DayQuil']),
      parent: { connect: { userId: getRandomElement(clientObjects).userId } }
    }
  });
}

async function main(): Promise<void> {
  const currentUsers: User[] = await prisma.user.findMany();

  // if database already seeded, move on
  if (currentUsers.length > 0) {
    console.log('Error seeding: DB not empty!');
    return;
  }

  // Create questions
  for (const question of questionData) {
    await prisma.onboardingQuestion.create({
      data: question
    });
  }
  console.log('Seeding: Finished seeding questions!');

  // Create recommended plans
  for (const recommendedPlanData of recommendedPlansData) {
    await prisma.recommendedPlan.create({
      data: recommendedPlanData
    });
  }
  console.log('Seeding: Finished seeding recommended plans!');

  // Create owner
  // @ts-expect-error we may want to use the babyObjects to seed further in the future
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const ownerObject: User = await createOwnerData();
  // Create coaches
  const coachObjects: User[] = await Promise.all(
    Array.from({ length: TOTAL_COACHES }, createCoachData)
  );
  console.log('Seeding: Finished seeding coaches!');

  // Create users
  const clientObjects: User[] = await Promise.all(
    Array.from({ length: TOTAL_CLIENTS }, async (_, i) => {
      if (i === 0) {
        return await prisma.user.create({
          data: {
            userId: MY_OWNER_ID,
            email: 'harooks@gmail.com',
            first_name: 'Haruko',
            last_name: 'Test',
            role: 'client'
          }
        });
      } else {
        return await createClientData(coachObjects);
      }
    })
  );
  console.log('Seeding: Finished seeding clients!');

  // Create babies
  // @ts-expect-error we may want to use the babyObjects to seed further in the future
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const babyObjects: Baby[] = await Promise.all(
    Array.from(
      { length: TOTAL_BABIES },
      async () => await createBabyData(clientObjects)
    )
  );
  console.log('Seeding: Finished seeding babies!');

  // Create events
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - TOTAL_DAYS);
  const events: Event[] = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    // create feed events
    const numFeedEvents = getRandomNumber(2, 6);
    for (let j = 0; j < numFeedEvents; j++) {
      const startTime = new Date(startDate);
      startTime.setHours(getRandomNumber(9, 17));
      startTime.setMinutes(getRandomNumber(0, 59));
      events.push(await createFeedEvent(startTime));
    }

    // create medicine events
    const numMedicineEvents = getRandomNumber(1, 3);
    for (let j = 0; j < numMedicineEvents; j++) {
      const startTime = new Date(startDate);
      startTime.setHours(getRandomNumber(9, 17));
      startTime.setMinutes(getRandomNumber(0, 59));
      events.push(await createMedicineEvent(startTime));
    }

    // create nap events
    try {
      const numNapEvents = getRandomNumber(2, 5);
      let prevEndTime = new Date(startDate);
      prevEndTime.setHours(9); // Start at 9am
      for (let j = 0; j < numNapEvents; j++) {
        const eventId = 'testID_' + generateUniqueID();
        const startTime = new Date(
          prevEndTime.getTime() + getRandomNumber(1, 3) * 60 * 60 * 1000
        );
        // startTime.setHours(getRandomNumber(9, 17));
        // startTime.setMinutes(getRandomNumber(0, 59));
        const endTime = new Date(
          startTime.getTime() + getRandomNumber(1, 2) * 60 * 60 * 1000
        );
        if (endTime.getHours() > 19) {
          break;
        }
        // endTime.setHours(getRandomNumber(startTime.getHours(), 18));
        // endTime.setMinutes(getRandomNumber(startTime.getMinutes(), 59));
        const cribStartTime = new Date(startTime);
        cribStartTime.setMinutes(
          cribStartTime.getMinutes() - getRandomNumber(5, 40)
        );
        const cribStopTime = new Date(endTime);
        cribStopTime.setMinutes(
          cribStopTime.getMinutes() + getRandomNumber(5, 30)
        );
        events.push(
          await createNapEvent(
            eventId,
            startTime,
            endTime,
            cribStartTime,
            cribStopTime
          )
        );
        await createWindows(
          eventId,
          startTime,
          endTime,
          getRandomOddNumber(1, 6)
        );
        prevEndTime = new Date(endTime);
      }
    } catch (error) {
      console.error('error seeding nap', error);
    }

    // create night sleep event
    // start between 6-9pm to 5-9am next day
    try {
      const eventId = 'testID_' + generateUniqueID();
      const startTime = new Date(startDate);
      startTime.setHours(getRandomNumber(18, 20));
      startTime.setMinutes(getRandomNumber(0, 59));
      const endTime = new Date(startDate);
      endTime.setDate(endTime.getDate() + 1);
      endTime.setHours(getRandomNumber(5, 9));
      endTime.setMinutes(getRandomNumber(0, 59));
      const cribStartTime = new Date(startTime);
      cribStartTime.setMinutes(
        cribStartTime.getMinutes() - getRandomNumber(5, 40)
      );
      const cribStopTime = new Date(endTime);
      cribStopTime.setMinutes(
        cribStopTime.getMinutes() + getRandomNumber(5, 40)
      );
      events.push(
        await createNightSleepEvent(
          eventId,
          startTime,
          endTime,
          startTime,
          endTime
        )
      );
      await createWindows(
        eventId,
        startTime,
        endTime,
        getRandomOddNumber(1, 8)
      );
    } catch (error) {
      console.error('error seeding night sleep', error);
    }
    startDate.setDate(startDate.getDate() + 1); // next day
  }
  console.log('Seeding: Finished seeding events!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: Error) => {
    // Provide a valid type for the catch parameter
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
