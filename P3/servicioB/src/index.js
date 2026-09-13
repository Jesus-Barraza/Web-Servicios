const express = require('express');
const cors = require('cors');
require('dotenv').config();

const verificarToken = require('./verificarToken.js');
const tareasRoutes = require('./tareas.routes.js');

const app = express();
app.use(cors());
app.use(express.json());

//Log de las tareas
app.use((req, res, next) => {
  console.log(`[RECURSO] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

//Ruta pública
app.get('/salud', (req, res) => res.json({ servicio: 'recurso', estado: 'ok' }));
app.use('/', verificarToken, tareasRoutes);

app.use((err, req, res, next) => {
  console.error('[RECURSO][ERROR]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 ? 'Error interno del servidor' : (err.message || 'Error');

  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servicio B en http://localhost:${PORT}`));

