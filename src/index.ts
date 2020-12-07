import 'module-alias/register';

import express from 'express';
import cors from 'cors';

import searchRoutes from '~routes/search';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;

app.use(cors());

// Register routes
searchRoutes.registerHandler(app);

app.get('/test', (req, res) => {
  return res.send('HELLO IM HERE');
});

app.listen(port, () => {
  console.log(`>>>>> API Server is listening on port ${port}`);
});