import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // There seems to be a missing user creation here
    // Let's create a test user first or get an existing one
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });
    
    console.log(`Created or found user: ${user.name}`);
    
    // Create 5 devices
    const devices = [];
    for (let i = 1; i <= 5; i++) {
      const device = await prisma.device.upsert({
        where: { 
          serialNumber: `SN${i}000` 
        },
        update: {},
        create: {
          name: `Scanner ${i}`,
          serialNumber: `SN${i}000`,
          userId: user.id,
        },
      });
      devices.push(device);
      console.log(`Created device: ${device.name}`);
    }

    // Generate random scans for the past 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const statuses = ['completed', 'failed', 'pending'];
    const apnPrefixes = ['APN', 'LOT', 'BOX'];

    // Clear existing scans to avoid duplication during reseeds
    await prisma.scan.deleteMany({
      where: {
        deviceId: {
          in: devices.map(d => d.id)
        }
      }
    });

    // Generate random scans for each device
    for (const device of devices) {
      const scanCount = Math.floor(Math.random() * 100) + 50; // 50-150 scans per device
      
      for (let i = 0; i < scanCount; i++) {
        const randomDate = new Date(
          thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
        );
        
        const apnPrefix = apnPrefixes[Math.floor(Math.random() * apnPrefixes.length)];
        const apn = `${apnPrefix}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`;
        const status = statuses[Math.floor(Math.random() * 0.8 * statuses.length)]; // 80% chance of completed
        
        await prisma.scan.create({
          data: {
            timestamp: randomDate,
            apn: apn,
            status: status,
            deviceId: device.id,
          },
        });
      }
      
      console.log(`Created scans for device: ${device.name}`);
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();