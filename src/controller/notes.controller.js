import { Router } from "express";
import {
    add,
    getAll,
    get,
    update,
    deletee
} from "../core/notes/notes.service.js";
import { authGuard } from "../common/guard/auth.guard.js";

const notesRouter = Router();

notesRouter.post("/", authGuard, add);
notesRouter.get("/", authGuard, getAll);
notesRouter.get("/:id", authGuard, get);
notesRouter.put("/:id", authGuard, update);
notesRouter.delete("/:id", authGuard, deletee);

export default notesRouter;
