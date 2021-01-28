import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import retailSpec from '../openapi.json';
import './config/passport';
import routes from './routes';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(retailSpec));

export default app;
