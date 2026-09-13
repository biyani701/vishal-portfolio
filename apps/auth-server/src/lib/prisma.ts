import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Function to test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check if the database is accessible
    await prisma.$queryRaw`SELECT 1`;
    console.log('[prisma] Database connection successful');
    return true;
  } catch (error) {
    console.error('[prisma] Database connection failed:', error);
    return false;
  }
}

export default prisma;
