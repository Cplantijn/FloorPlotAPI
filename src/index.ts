import 'module-alias/register';

import express from 'express';
import cors from 'cors';

import searchRoutes from '~routes/search';

const app = express();
const port = process.env.API_PORT ? parseInt(process.env.API_PORT) : 3030;

app.use(cors());

// Register routes
searchRoutes.registerHandler(app);


app.listen(port, () => {
  console.log(`>>>>> API Server is listening on port ${port}`);
});