import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/usersRouter/usersRouter";
import generalError from "../middlewares/generalError/generalError";
import { routers } from "../configs/routes";
import projectsRouter from "./routers/projectsRouter/projectsRouter";
import environment from "../configs/environment";
import notFoundError from "../middlewares/notFoundError/notFoundError";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: environment.client,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static("uploads"));

app.use(routers.users, usersRouter);
app.use(routers.projects, projectsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
