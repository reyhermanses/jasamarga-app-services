import express from 'express';
import cors from 'cors';

import routes from './routes/Routes';
import authRoutes from './routes/AuthRoutes';
import cronRoutes from './routes/CronRoutes';
import { authenticateJWT } from './middlewares/Auth';
import sequelize from './config/Sequelize';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

// Allow requests from a specific origin (your frontend app)
const allowedOrigins = [
  'http://cronjob-monitoring-frontend-cronjob-monitoring.apps.ocprd.jasamarga.co.id', 
  'http://cronjob-monitoring-frontend-aggregator-postgres-v3.apps.ocdev.jasamarga.co.id',
  'http://cronjob-monitoring-frontend-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id',
  'https://api-gateway.jasamarga.co.id/prd/employee',
  'https://api-gateway.jasamarga.co.id/dev/employee'
];

// const corsOptions: cors.CorsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// Enable CORS with the specified options

const nodeEnv:string = process.env.NODE_ENV || 'production';
// if (nodeEnv === 'production') {
//   app.use(cors(corsOptions));
// } else {
  app.use(cors());
// }

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('\x1b[36m%s\x1b[0m', 'Connection to DB has been established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.json('Cronjob Monitoring Backend V1.0.0');
});


app.use('/api', routes);

app.use('/cron', authenticateJWT, cronRoutes);

app.use('/auth', authRoutes);

checkConnection()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});