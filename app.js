const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mejoramos la conexión para que sea robusta
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Conectado exitosamente a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar a la BD:', err.message);
    process.exit(1); // Detiene el servidor si no hay base de datos
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('Servidor activo');
});

// RUTA DE REGISTRO
app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    
    // Encriptar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear
    const newUser = new User({ nombre, email, password: hashedPassword, rol });
    await newUser.save();
    
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ error: "Error interno al guardar el usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
