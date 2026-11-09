import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { createCorsOptions } from '@/config/cors';
import { env } from '@/config/env';
import { errorHandler } from '@/middlewares/error-handler';
import { notFoundHandler } from '@/middlewares/not-found';
import router from '@/routes';

const app = express();

app.use(helmet());
app.use(cors(createCorsOptions(env.corsOrigins)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

// Must be registered last, after every route.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
