const express = require('express');
const pool = require('./db');
const validarTarea = require('./validarTarea')

const router = express.Router();

router.get('/tareas', async (req, res, next) => {
  try {
    const [filas] = await pool.execute(
      'SELECT id, titulo, completada, creado_en FROM tareas WHERE usuario_id = ? ORDER BY id DESC',
      [req.usuario.id]
    );

    res.json(filas);
  } catch (err) {
    next(err);
  }
});

router.post('/tareas', validarTarea, async (req, res, next) => {
  try {
    const { titulo } = req.body;
    const [resultado] = await pool.execute(
      'INSERT INTO tareas (titulo, usuario_id) VALUES (?, ?)',
      [String(titulo).trim(), req.usuario.id]
    );

    res.status(201).json({
      id: resultado.insertId,
      titulo: String(titulo).trim(),
      completada: false
    });
  } catch (err) {
    next(err);
  }
});

router.put('/tareas/:id', async (req, res, next) => {
  try {
    const { titulo, completada } = req.body;
    if (!titulo.trim() || typeof completada !== 'boolean') {
      return res.status(400).json({error: "Titulo o estados incorrectos"});
    }

    const [r] = await pool.execute(
      'UPDATE tareas SET titulo = ?, completada = ? WHERE id = ?',
      [titulo, completada ? 1 : 0, req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ id: Number(req.params.id), titulo, completada: !!completada });
  } catch (err) {
    next(err);
  }
});

router.delete('/tareas/:id', async (req, res, next) => {
  try {
    const [r] = await pool.execute('DELETE FROM tareas WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;