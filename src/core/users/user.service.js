import { pool } from "../../common/database/database.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getConfig from "../../common/config/config.service.js";
import {
    createValidator,
    idValidator,
    loginValidator,
    updateValidator,
} from "./user.validator.js";

export async function add(req, res) {
    try {
        const { username, email, password } = req.body;
        const { error } = createValidator.validate({
            username,
            email,
            password,
        });
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        const dbUser = await findUserByEmail(username);
        if (dbUser) {
            return res
                .status(400)
                .send({ error: "Bunday username oldin ro'yhatdan o'tgan" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO note_users (username, email, password ) VALUES
            ($1, $2, $3 )`,
            [username, email, hashedPassword]
        );
        const accessToken = generateAccessToken({ username });
        const refreshToken = generateRefreshToken({ username });
        res.status(200).send({
            accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
}

export async function getAll(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM note_users`);
        res.send(result.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
export async function get(req, res, next) {
    try {
        const { error: errorParams } = idValidator.validate(req.params);
        if (errorParams) {
            return res
                .status(400)
                .send({ error: errorParams.details[0].message });
        }
        const { id } = req.params;
        const result = await pool.query(
            `SELECT * FROM note_users WHERE id = $1`,
            [id]
        );
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
        const old = await pool.query(`SELECT * FROM note_users WHERE id = $1`, [
            id,
        ]);
        const { username, email, password } = {
            ...old.rows[0],
            ...nev,
        };
        const result = await pool.query(
            `UPDATE note_users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
            [username, email, password, id]
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
            return res.status(400).send(errorParams.details[0].message);
        }
        const { id } = req.params;
        const result = await pool.query(
            `DELETE FROM note_users WHERE id = $1`,
            [id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
export async function findUserByEmail(username) {
    const result = await pool.query(
        `
    SELECT * FROM note_users WHERE username=$1
  `,
        [username]
    );
    return result.rows[0];
}
export async function login(req, res) {
    try {
        const user = req.body;
        console.log(user);
        const { error } = loginValidator.validate(user);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const dbUser = await findUserByEmail(user.username);
        if (!dbUser) {
            return res
                .status(400)
                .send({ error: "Bunday username oldin ro'yhatdan o'tmagan" });
        }

        const checkPassword = await bcrypt.compare(
            user.password,
            dbUser.password
        );

        if (!checkPassword) {
            return res.status(401).send("Username yoki parol hato");
        }

        const accessToken = generateAccessToken({ username: user.username });
        const refreshToken = generateRefreshToken({ username: user.username });
        res.status(200).send({
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
}

export async function refresh(req, res) {
    try {
        const user = req.body;
        const accessToken = generateAccessToken({ email: user.refToken });
        res.status(200).send({ accessToken });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
function generateAccessToken(data) {
    return jwt.sign(data, getConfig("JWT_ACCCES_SECRET"), { expiresIn: "1d" });
}

function generateRefreshToken(data) {
    return jwt.sign(data, getConfig("JWT_REFRESH_SECRET"), { expiresIn: "7d" });
}
