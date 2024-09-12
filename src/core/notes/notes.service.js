import getConfig from "../../common/config/config.service.js";
import { pool } from "../../common/database/database.service.js";
import { findUserByEmail } from "../users/user.service.js";
import {
    createValidator,
    idValidator,
    updateValidator,
} from "./notes.validator.js";
import jwt from "jsonwebtoken";

export async function add(req, res) {
    try {
        const { title, description } = req.body;
        const { error } = createValidator.validate({
            title,
            description,
        });
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        const token = req.headers.authorization?.split(" ")[1];
        const { username } = jwt.verify(token, getConfig("JWT_ACCCES_SECRET"));
        const { id } = await findUserByEmail(username);

        const result = await pool.query(
            `INSERT INTO notes (title, description, user_id) VALUES
            ($1, $2, $3)  RETURNING *`,
            [title, description, id]
        );
        res.status(200).send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
}

export async function getAll(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM notes`);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
export async function get(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { username } = jwt.verify(token, getConfig("JWT_ACCCES_SECRET"));
        const result = await pool.query(
            `SELECT notes.id, notes.title, notes.description, notes.user_id FROM notes 
            JOIN note_users ON notes.user_id = note_users.id WHERE note_users.username = $1`,
            [username]
        );
        res.send(result.rows);
    } catch (err) {
        console.log(err);
        res.send({ error: err.message });
    }
}

export async function update(req, res) {
    try {
        const nev = req.body;
        const { error } = updateValidator.validate(nev);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { id } = req.params;

        const old = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
        const { title, description } = {
            ...old.rows[0],
            ...nev,
        };
        const result = await pool.query(
            `UPDATE notes SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
            [title, description, id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function deletee(req, res) {
    try {
        const { error: errorParams } = idValidator.validate(req.params);
        if (errorParams) {
            return res
                .status(400)
                .send({ error: errorParams.details[0].message });
        }
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM notes WHERE id = $1`, [
            id,
        ]);
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
