// src/app.ts
import express, { Request, Response } from "express";
import routes from "./routes/Routes";
import routeMaster from "./routes/RoutesMaster";
const cors = require('cors');

import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.use("/api", routes);
app.use("/master", routeMaster);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
