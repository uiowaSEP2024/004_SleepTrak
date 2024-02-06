var { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const TOTAL_CLIENTS = 30;
const TOTAL_BABIES = 40;
const TOTAL_COACHES = 5;
const possibleNames = [
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

function getRandomElement(list) {
  if (list.length === 0) {
    console.error('Error: The array is empty.');
    return undefined; // or any other value that makes sense in your context
  }

  let index = Math.floor(Math.random() * list.length);
  return list[index];
}

function getRandomNumber(minValue, maxValue) {
  const difference = Math.abs(maxValue - minValue);
  return Math.floor(minValue + Math.random() * difference);
}

function createCoachData() {
  newCoach = {
    email: 'coach' + getRandomNumber(0, 10000000) + '@test.com',
    first_name: getRandomElement(possibleNames),
    last_name: 'Test',
    role: 'coach'
  };
  return newCoach;
}
function createClientData(coachObjects) {
  newClient = {
    email: 'client' + getRandomNumber(0, TOTAL_CLIENTS * 10000) + '@test.com',
    first_name: getRandomElement(possibleNames),
    last_name: 'Test',
    role: 'client',
    coach: { connect: { userId: getRandomElement(coachObjects).userId } }
  };
  return newClient;
}
function createBabyData(clientObjects) {
  newBaby = {
    name: getRandomElement(possibleNames),
    dob: new Date(
      getRandomNumber(2018, 2024), // year
      getRandomNumber(1, 12), // month
      getRandomNumber(1, 30) // day
    ),
    weight: getRandomNumber(1, 10),
    medicine: getRandomElement(['Advil', 'NyQuil', 'DayQuil']),
    parent: { connect: { userId: getRandomElement(clientObjects).userId } }
  };
  return newBaby;
}

async function main() {
  currentUsers = await prisma.user.findMany();

  // if database already seeded, move on
  if (currentUsers.length > 0) {
    console.log('Error seeding: DB not empty!');
    return;
  }

  // Create coaches
  let coachObjects = [];
  for (let i = 0; i < TOTAL_COACHES; i++) {
    coachObjects.push(await prisma.user.create({ data: createCoachData() }));
  }
  console.log('Seeding: Finished seeding coaches!');

  // Create users
  let clientObjects = [];
  for (let i = 0; i < TOTAL_CLIENTS; i++) {
    clientObjects.push(
      await prisma.user.create({
        data: createClientData(coachObjects)
      })
    );
  }
  console.log('Seeding: Finished seeding clients!');

  // Create users
  let babyObjects = [];
  for (let i = 0; i < TOTAL_BABIES; i++) {
    babyObjects.push(
      await prisma.baby.create({ data: createBabyData(clientObjects) })
    );
  }
  console.log('Seeding: Finished seeding babies!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
