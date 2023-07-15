require('dotenv').config();
import { AppDataSource } from './data-source';
import server from './server';

const PORT = Number(process.env.PORT) || 4000;

export const startServer = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      // Start the server and you're done!
      server.listen(PORT, () => {
        console.info(`Server is running on http://localhost:${PORT}/graphql`);
      });
    })
    .catch((error) => console.log(error));
};

startServer();
