import express from "express";
import indexRouter from "./routes";


const port = 3000;
const app = express();
const mainRouter = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", mainRouter);
mainRouter.use("/", indexRouter);

app.listen(port);