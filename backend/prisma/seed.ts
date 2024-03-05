import { PrismaClient } from '@prisma/client';
import type { User, Baby } from '@prisma/client';

const prisma = new PrismaClient();
const TOTAL_CLIENTS: number = 30;
const TOTAL_BABIES: number = 40;
const TOTAL_COACHES: number = 5;
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
    onboarding_screen: 1
  },
  {
    questionId: '3',
    description: "What is your Baby's name?",
    type: 'small-text',
    onboarding_screen: 1
  },
  {
    questionId: '4',
    description: 'When was your Baby born?',
    type: 'date',
    onboarding_screen: 1
  },
  {
    questionId: '5',
    description: 'Does your child have any medical conditions?',
    type: 'large-text',
    onboarding_screen: 2
  },
  {
    questionId: '6',
    description:
      "Briefly describe your child's sleep environment - Where do they sleep? Who do they sleep with? Do they have a routine? What is the environment like? ",
    type: 'large-text',
    onboarding_screen: 3
  },
  {
    questionId: '7',
    description:
      "Please tell me briefly what your child's day looks like in terms of sleep and feeds: Example: 7am wakes up, 9am eats, 10am nap...",
    type: 'large-text',
    onboarding_screen: 4
  },
  {
    questionId: '8',
    description: 'How does your child fall asleep at night?',
    type: 'large-text',
    onboarding_screen: 5
  },
  {
    questionId: '9',
    description: 'How many times does your child wake up per night?',
    type: 'number',
    onboarding_screen: 5
  },
  {
    questionId: '10',
    description:
      'Have you tried any methods to help your baby sleep better in the past? Tell me in detail about your experience.',
    type: 'large-text',
    onboarding_screen: 6
  },
  {
    questionId: '11',
    description: 'What sleep goals would you like to achieve?',
    type: 'large-text',
    onboarding_screen: 7
  },
  {
    questionId: '12',
    description:
      'Have you started implementing my Baby/Toddler Sleep Learning program?',
    type: 'yes-no',
    onboarding_screen: 8
  },
  {
    questionId: '13',
    description:
      "Please tell me in detail any additional information that can help me understand your child & family's sleep situation.",
    type: 'large-text',
    onboarding_screen: 9
  }
];

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

async function createCoachData(): Promise<User> {
  return await prisma.user.create({
    data: {
      userId: 'testID_' + getRandomNumber(0, 10000).toString(),
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
      userId: 'testID_' + getRandomNumber(10001, 20000).toString(),
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
      babyId: 'testID_' + getRandomNumber(0, 10000).toString(),
      name: getRandomElement(possibleNames),
      dob: new Date(
        getRandomNumber(2018, 2024), // year
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

  // Create coaches
  const coachObjects: User[] = await Promise.all(
    Array.from({ length: TOTAL_COACHES }, createCoachData)
  );
  console.log('Seeding: Finished seeding coaches!');

  // Create users
  const clientObjects: User[] = await Promise.all(
    Array.from(
      { length: TOTAL_CLIENTS },
      async () => await createClientData(coachObjects)
    )
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
