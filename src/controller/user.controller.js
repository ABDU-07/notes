import { Router } from "express";
import {
    add,
    getAll,
    get,
    update,
    deletee,
    login,
    refresh,
} from "../core/users/user.service.js";
import { authGuard, ref } from "../common/guard/auth.guard.js";

const note_usersRouter = Router();
// note_usersRouter.get("/", (req, res) => {
//     res.send("Qonde Endi");
// });

note_usersRouter.post("/register", add);
// note_usersRouter.get("/", authGuard, getAll);
note_usersRouter.get("/", authGuard, get);
note_usersRouter.put("/:id", authGuard, update);
note_usersRouter.delete("/:id", authGuard, deletee);
note_usersRouter.post("/login", login);
note_usersRouter.post("/refresh", ref, refresh);

export default note_usersRouter;
