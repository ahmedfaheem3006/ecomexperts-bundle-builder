import { createApp } from './app.js';
import { serverConfig } from './config.js';

const app = createApp();

app.listen(serverConfig.PORT, () => {
  console.log(`Server listening on http://localhost:${serverConfig.PORT}`);
});
