import express from "express";
import cors from "cors";
import helmet from "helmet";

import sequelize from "./config/Sequelize";

import routes from "./routes/Routes";
import adminRoutes from "./routes/AdminRoutes";

import * as dotenv from "dotenv";
import { authenticateToken } from "./middlewares/Secure";
dotenv.config();

const app = express();

// Allow requests from a specific origin (your frontend app)
// const allowedOrigins = ["http://localhost:3000"];

// const corsOptions: cors.CorsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// const nodeEnv: string = process.env.NODE_ENV || "production";
// if (nodeEnv === "production") {
//   console.log("prod");
//   // app.use(cors(corsOptions));
//   app.use(cors(corsOptions));
// } else {
//   console.log("dev");
// }

const allowedOrigins = [
  "http://reset-password-frontend-reset-password.apps.ocprd.jasamarga.co.id",
  "http://reset-password-frontend-reset-password.apps.ocdev.jasamarga.co.id",
  "http://reset-password-admin-frontend-reset-password.apps.ocprd.jasamarga.co.id",
  "http://reset-password-admin-frontend-reset-password.apps.ocdev.jasamarga.co.id",
  "http://reset-password-frontend-aggregator-postgres-v3.apps.ocdev.jasamarga.co.id",
  "http://reset-password-frontend-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id",
  "http://reset-password-admin-frontend-aggregator-postgres-v3.apps.ocdev.jasamarga.co.id",
  "http://reset-password-admin-frontend-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id",
  "https://be-usermanagement.jasamarga.co.id",
  "https://fe-usermanagement.jasamarga.co.id",
  "http://localhost:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(helmet.frameguard({ action: "deny" }));

app.use(helmet.noSniff());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.disable("x-powered-by");

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("\x1b[36m%s\x1b[0m", "Connection to DB has been established.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// const PORT = 3000;

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Backend Management User V1.0.5");
});

app.use("/api", routes);
app.use("/api/admin", authenticateToken, adminRoutes);

checkConnection();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
