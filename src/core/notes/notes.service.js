import { pool } from "../../common/database/database.service.js";
import {
    createValidator,
    idValidator,
    updateValidator,
} from "./notes.validator.js";

export async function add(req, res) {
    try {
        const { title, description, user_id } = req.body;
        const { error } = createValidator.validate({
            title,
            description,
            user_id,
        });
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const result = await pool.query(
            `INSERT INTO notes (title, description, user_id) VALUES
            ($1, $2, $3)  RETURNING *`,
            [title, description, user_id]
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
        const { error: errorParams } = idValidator.validate(req.params);
        if (errorParams) {
            return res.status(400).send(errorParams.details[0].message);
        }
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [
            id,
        ]);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.send({ error: err.message });
    }
}

export async function update(req, res) {
    try {
        const { error: errorParams } = idValidator.validate(req.params);
        if (errorParams) {
            return res
                .status(400)
                .send({ error: errorParams.details[0].message });
        }
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
