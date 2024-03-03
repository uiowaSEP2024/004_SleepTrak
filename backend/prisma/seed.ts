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
