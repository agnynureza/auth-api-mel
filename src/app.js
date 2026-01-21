import 'dotenv/config';
import createServer from './infrastructure/http/createServer.js';
import container from './infrastructure/container.js';
import config from './commons/config.js';
 
const start = async () => {
  const app = await createServer(container);
  const { host, port } = config.app;
 
  app.listen(port, host, () => {
    console.log(`server start at http://${host}:${port}`);
  });
};
 
start();