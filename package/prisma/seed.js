const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const APNS = ['eduroam', 'legacynet', 'Hofstra Guest'];
const STATUS = ['completed', 'pending', 'failed'];
const DEVICE_IDS = [1, 2, 3, 4];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTimestamp(year) {
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(year, month, day, hour, minute, second);
}

async function main() {
  const years = [2022, 2023, 2024];

  for (const year of years) {
    for (let i = 0; i < 100; i++) {
      await prisma.scan.create({
        data: {
          timestamp: getRandomTimestamp(year),
          apn: getRandomElement(APNS),
          status: getRandomElement(STATUS),
          deviceId: getRandomElement(DEVICE_IDS),
        },
      });
    }
  }

  console.log('Seeded 100 scans per year for 2022–2024 (total: 300)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
