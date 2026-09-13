const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db.js");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
        }
        const hash = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        const [resultado] = await pool.execute(sql, [nombre, email, hash]);
        res.status(201).json({ id: resultado.insertId, nombre, email });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya esta registrado' });
        }
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email y password son obligatorios' });
        }
        const [filas] = await pool.execute(
        'SELECT id, nombre, email, password FROM usuarios WHERE email = ?', [email]);
        if (filas.length === 0) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }
        const usuario = filas[0];
        const ok = await bcrypt.compare(password, usuario.password);
        if (!ok) return res.status(401).json({ error: 'Credenciales invalidas' });
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' });
        res.json({ token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (err) { 
        next(err); 
    }
});

module.exports = router;