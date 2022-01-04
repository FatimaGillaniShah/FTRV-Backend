import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import apiSpec from '../openapi.json';
import './config/passport';
import routes from './routes';
import handleErrors from './middlewares/errorHandler';
import Acl from './lib/acl';
import { MAX_BODY_SIZE } from './utils/constants';
import { createWebSocketPing } from './utils/helper';

const app = express();
app.use(cors());
createWebSocketPing();
Acl.updateAccessControlList();
app.use(bodyParser.json({ limit: MAX_BODY_SIZE }));
app.use(bodyParser.urlencoded({ limit: MAX_BODY_SIZE, extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/assets', express.static('public/uploads'));
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
app.use(handleErrors);

export default app;
