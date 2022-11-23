import { createServer } from './createServer';

function main() {
  try {
    // const PORT: number = parseInt(process.env.PORT as string, 10);
    const server = createServer();
    console.log(server);

    // console.log(`Server started on port ${PORT}`);

    async function onClose() {
      await server.stop();
      process.exit(0);
    }

    process.on('SIGTERM', onClose);
    process.on('SIGQUIT', onClose);

  } catch (error: any) {
    console.log(error.message);
  }
}

main();
