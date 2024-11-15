import express from 'express';
import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';
import cookieParser from 'cookie-parser';

import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';

import routes from './routes/index.js';
import swagger from '../swagger.js';

const port = process.env.PORT || 3000;

const start = async () => {
  const app = express();

  await initializeDb();

  const admin = new AdminJS(options);

  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET || 'default_cookie_secret',
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    },
  );

  app.use(express.static("public"));

  app.use(admin.options.rootPath, router);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/api', routes);

  swagger(app);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
