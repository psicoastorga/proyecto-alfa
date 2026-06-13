const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

app.use(express.static('public'));
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
    const { nombre, email, password } = req.body;
    
    // Encriptar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Validar mail existente 
    const existingUser = await User.findOne({
    email
      });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email ya registrado'
    });
}
    
    
    // Crear
    const newUser = new User({ nombre, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    res.status(500).json({ error: "Error interno al guardar el usuario" });
  }
});


//Ruta Login
app.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: 'Usuario no encontrado'
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
			{
				id: user._id,
				rol: user.rol
			},
				process.env.JWT_SECRET,
			{
				expiresIn: '24h'
			}
			);

			res.json({
			message: 'Login exitoso',
			token
			});
      
      
    } catch (error) {

        res.status(500).json({
            error: 'Error interno'
        });

    }
});

//RUTA PERFIL 
app.get('/perfil', auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select('-password');

        res.json(user);

    } catch (error) {

        res.status(500).json({
            error: 'Error al obtener perfil'
        });

    }

});

// ACTUALIZAR PERFIL
app.put('/perfil', auth, async (req, res) => {

    try {

        const { nombre, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                nombre,
                email
            },
            {
                new: true
            }
        );

        res.json({
            message: 'Perfil actualizado',
            user
        });

    } catch (error) {

        res.status(500).json({
            error: 'Error al actualizar perfil'
        });

    }

});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
