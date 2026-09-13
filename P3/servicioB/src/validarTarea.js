function validarTarea(req, res, next) {
  const { titulo } = req.body;
  if (titulo === undefined || titulo === null || String(titulo).trim() === '') {
    return res.status(400).json({ error: 'El campo "titulo" es obligatorio' });
  }
  if (String(titulo).length > 200) {
    return res.status(400).json({ error: 'El "titulo" no puede exceder 200 caracteres' });
  }
  next();
}
module.exports = validarTarea;