import { PrismaClient } from '@prisma/client';
import createServer from './createServer';

const prisma = new PrismaClient();

export async function main() {
  try {
    // const PORT: number = parseInt(process.env.PORT as string, 10);
    const server = await createServer();
    await server.start();
    server.getApp();

    // console.log(`Server started on port ${PORT}`);
    
    await prisma.$connect();

    async function onClose() {
      await prisma.$disconnect();
      await server.stop();
      process.exit(0);
    }

    prisma.$on('beforeExit', onClose);

    process.on('SIGTERM', onClose);
    process.on('SIGQUIT', onClose);

  } catch (error: any) {
    console.log(error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
