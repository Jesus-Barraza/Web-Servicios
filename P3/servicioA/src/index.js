const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth.routes.js');

const app = express();
app.use(cors());
app.use(express.json());

//Log de las tareas
app.use((req, res, next) => {
  console.log(`[RECURSO] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/salud', (req, res) => res.json({ servicio: 'autenticación', estado: 'ok' }));
app.use('/', authRoutes);

app.use((err, req, res, next) => {
  console.error('[AUTH][ERROR]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => 
  console.log(`Servicio A en http://localhost:${PORT}`)
);