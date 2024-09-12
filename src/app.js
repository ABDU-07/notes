import express from "express";
import getConfig from "./common/config/config.service.js";
import { initDatabase } from "./common/database/database.service.js";
import usersRouter from "./controller/user.controller.js";
import notesRouter from "./controller/notes.controller.js";

const app = express();

function initRoutes() {
    app.use("/users", usersRouter);
    app.use("/notes", notesRouter);
}

const PORT = getConfig("EXPRESS_PORT") || 3000;
async function init() {
    app.use(express.json());
    await initDatabase();
    initRoutes();
    app.listen(PORT, () => console.log(`Server ${PORT} ishladi`));
}
init();
