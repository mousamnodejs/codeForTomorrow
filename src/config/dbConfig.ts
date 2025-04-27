import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dbConfig = async () => {
  try {
    // Try to connect to the database and check connection status
    await prisma.$connect();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default prisma;
